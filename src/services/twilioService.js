import { Client as TwilioChatClient } from 'twilio-chat';
import store from '../redux/store';
import CONFIG from '../../config.js';
import MessageService from './messageService.js';

const API_URL = CONFIG.ENV === 'PROD' ? CONFIG.API_URL : CONFIG.TEST_API_URL;
const MAX_MESSAGES_TO_LOAD = 30;

class TwilioService {
  constructor(hmToken, contacts, messagesCallback) {
    this.hmToken = hmToken;
    this.id = `${JSON.parse(hmToken)._id}`;

    this.chatClient = null;
    this.messageService = new MessageService(messagesCallback);

    // Map user_id to chat channel object
    this.channels = {};
    this.contacts = store.getState().persist.contactsList.items.filter(({ id }) => contacts.includes(id));

    this.startup(this.contacts);
  }

  async startup(contacts) {
    const success = await this.loadTwilioClient();
    if (success) {
      // Initialize all channels
      try {
        const doneInitChannels = await this.initAllChannels(contacts);
        if (doneInitChannels) {
          await this.getAllMessages();
        } else {
          // TODO: something bad happened
        }
      } catch (e) {
        // TODO: Add sentry logging
      }
    } else {
      // TODO: Add failure logging
    }
  }

  async getAllMessages() {
    await this.contacts.map(contact => this.updateMessages(contact));
  }

  async sendMessage(contact, message) {
    try {
      const c = this.channels[contact];
      c.sendMessage(message);
    } catch (e) {
      // TODO: add sentry logging
    }
  }

  async initAllChannels(contacts) {
    let success;
    try {
      const map = contacts.map(
        contact => this.initSingleChannel(contact)
      );
      success = await Promise.all(map);
    } catch {
      // TODO: Add sentry logging
      return false;
    }
    return success.every(val => val);
  }

  async initSingleChannel(contact) {
    const channel = await this.chatClient.getChannelBySid(contact.channel_id);
    if (channel) {
      channel.on('messageAdded', message => this.messageService.updateLocalMessageStateSingle(contact, message));
      this.channels[contact.id] = channel;
      return true;
    }
    return false;
  }

  async loadTwilioClient() {
    // TODO: need to handle the case where the twilioToken in redux is expired
    // (currently it looks like the call to TwilioChatClient.create() fails with
    // an error window to the user)
    let localToken = store.getState().persist.user.twilioToken;
    if (localToken) {
      const clientReady = await this.initChatClient(localToken);
      if (clientReady) {
        return true;
      }
    }

    localToken = await this.getTwilioToken();
    if (localToken) {
      try {
        store.dispatch({
          type: 'SET_USER',
          data: {
            twilioToken: localToken
          }
        });
      } catch (e) {
        // TODO: add sentry
        // If we fail to set the local storage for the token, just continue processing
        // and we will attempt to cache the token again next time we refresh it
      }
      return this.initChatClient(localToken);
    }
    return false;
  }

  async getTwilioToken() {
    const localToken = JSON.parse(this.hmToken);
    const requestUri = `${API_URL}/chat/token/${localToken._id}?token=${localToken.api_key}`;
    // TODO: add device ID
    const bodyData = { device: 'test' };
    try {
      const response = await fetch(requestUri, { method: 'post', body: JSON.stringify(bodyData), headers: { 'Content-Type': 'application/json' } });
      const responseJson = await response.json();
      const twilioToken = responseJson.chat_token;
      return twilioToken;
    } catch (e) {
      // TODO: Add sentry logging
    }
    return false;
  }

  getChannelName(contact) {
    const localToken = JSON.parse(this.hmToken);
    return localToken._id > contact.id ? `${localToken._id}.${contact.id}` : `${contact.id}.${localToken._id}`;
  }

  async updateMessages(contact) {
    const channel = await this.chatClient.getChannelBySid(contact.channel_id);
    const messages = await channel.getMessages(MAX_MESSAGES_TO_LOAD);
    const loadPrevPageFor = async (newMessages) => {
      const previousMessages = await newMessages.prevPage();
      previousMessages.loadPrevPage = () => loadPrevPageFor(previousMessages);
      this.messageService.updateLocalMessageState(contact, previousMessages);
    };
    messages.loadPrevPage = () => loadPrevPageFor(messages);
    await this.messageService.updateLocalMessageState(contact, messages);
  }

  async tryInviteContact(contact) {
    try {
      // TODO: if the user isn't found, or if the user trying to invite doesn't have permission, we still
      //  end up showing the error screen, and not catching the failure...
      const c = await this.channels[contact];
      c.invite(contact);
    } catch (e) {
      // TODO: add sentry logging
    }
  }

  async createChannelWithUser(contact) {
    const channelName = this.getChannelName(contact);
    return this.chatClient.createChannel({
      uniqueName: channelName,
      friendlyName: channelName,
    });
  }

  async initChatClient(token) {
    try {
      const chatClient = await TwilioChatClient.create(token, { logLevel: 'info' });
      this.chatClient = chatClient;

      this.chatClient.on('tokenAboutToExpire', () => {
        this.getTwilioToken()
          .then(newData => this.chatClient.updateToken(newData))
          .catch(() => {
            // TODO: add sentry logging
          });
      });

      // Listen for new invitations to your Client
      this.chatClient.on('channelInvited', (channel) => {
        // Join the channel that you were invited to
        // TODO: add a call to the backend to check if we should be joining this channel
        channel.join();
      });

      // TODO: Decide which of these callbacks we need
      // this.subscribeToAllChatClientEvents();
      return true;
    } catch (e) {
      // TODO: add sentry logging
      return false;
    }
  }

  /*
  async subscribeToAllChatClientEvents() {
    // TODO: Ensure that all webooks from this doc are included:
    // https://www.twilio.com/docs/chat/webhook-events

    // This function is not currently called. We should decide which callbacks we want to handle, and how
    this.client.on('tokenAboutToExpire', obj => console.log('ChatClientHelper.client', 'tokenAboutToExpire', obj));
    this.client.on('tokenExpired', obj => console.log('ChatClientHelper.client', 'tokenExpired', obj));

    this.client.on('userSubscribed', obj => console.log('ChatClientHelper.client', 'userSubscribed', obj));
    this.client.on('userUpdated', obj => console.log('ChatClientHelper.client', 'userUpdated', obj));
    this.client.on('userUnsubscribed', obj => console.log('ChatClientHelper.client', 'userUnsubscribed', obj));

    this.client.on('channelAdded', obj => console.log('ChatClientHelper.client', 'channelAdded', obj));
    this.client.on('channelRemoved', obj => console.log('ChatClientHelper.client', 'channelRemoved', obj));
    this.client.on('channelInvited', obj => console.log('ChatClientHelper.client', 'channelInvited', obj));
    this.client.on('channelJoined', obj => console.log('ChatClientHelper.client', 'channelJoined', obj));
    this.client.on('channelLeft', obj => console.log('ChatClientHelper.client', 'channelLeft', obj));
    this.client.on('channelUpdated', obj => console.log('ChatClientHelper.client', 'channelUpdated', obj));

    this.client.on('memberJoined', obj => console.log('ChatClientHelper.client', 'memberJoined', obj));
    this.client.on('memberLeft', obj => console.log('ChatClientHelper.client', 'memberLeft', obj));
    this.client.on('memberUpdated', obj => console.log('ChatClientHelper.client', 'memberUpdated', obj));

    this.client.on('messageAdded', obj => console.log('ChatClientHelper.client', 'messageAdded', obj));
    this.client.on('messageUpdated', obj => console.log('ChatClientHelper.client', 'messageUpdated', obj));
    this.client.on('messageRemoved', obj => console.log('ChatClientHelper.client', 'messageRemoved', obj));

    this.client.on('typingStarted', obj => console.log('ChatClientHelper.client', 'typingStarted', obj));
    this.client.on('typingEnded', obj => console.log('ChatClientHelper.client', 'typingEnded', obj));

    this.client.on('connectionStateChanged', obj => console.log('ChatClientHelper.client', 'connectionStateChanged', obj));
    this.client.on('pushNotification', obj => console.log('ChatClientHelper.client', 'onPushNotification', obj));
  } */
}

export default TwilioService;
