import { Client as TwilioChatClient } from 'twilio-chat';
import store from '../redux/store';
import CONFIG from '../../config.js';
import MessageService from './messageService.js';

const API_URL = CONFIG.ENV === 'PROD' ? CONFIG.API_URL : CONFIG.TEST_API_URL;
const MAX_MESSAGES_TO_LOAD = 30;

class TwilioService {
  // TODO: Currently we recreate the twilio service every time we navigate to the chat
  // screen. We could probably be more efficient than that.
  constructor(hmToken, contacts, dispatch) {
    this.hmToken = hmToken;
    this.chatClient = null;

    // A map of user_id to twilio channel object.
    // We use this to know which channel to send a message to.
    this.channels = {};

    // Get the contacts from storage for the list of contacts we are initializing the twilio service for
    // TODO: We currently only pass 1 contact, the one for the user we are chatting with.
    // Instead, we should either remove this initialization, or initialize everyone at app start.
    this.contacts = store.getState().persist.contactsList.items.filter(({ id }) => contacts.includes(id));
    this.startup(this.contacts, dispatch);
  }

  async getMessagesPromise() {
    return this.messagesPromise;
  }

  async startup(contacts, dispatch) {
    const success = await this.loadTwilioClient();
    if (success) {
      // Initialize all channels
      try {
        const channel = await this.initSingleChannel(contacts[0]);
        if (channel) {
          await TwilioService.updateMessages(contacts[0], channel, dispatch);
        }
      } catch (e) {
        // TODO: Add sentry logging
      }
    } else {
      // TODO: Add failure logging
    }
    return [];
  }

  async sendMessage(contactId, message) {
    const channelId = store.getState().persist.contactsList.items.filter(({ id }) => contactId === id)[0].channel_id;

    try {
      const channel = await this.chatClient.getChannelBySid(channelId);
      channel.sendMessage(message);
    } catch (e) {
      // TODO: add sentry logging
    }
  }

  async initSingleChannel(contact) {
    const channel = await this.chatClient.getChannelBySid(contact.channel_id);
    if (channel) {
      // channel.on('messageAdded', message => this.messageService.updateLocalMessageStateSingle(contact, message));
      // this.channels[contact.id] = channel;
      return channel;
    }
    return false;
  }

  async loadTwilioClient() {
    // TODO: need to handle the case where the twilioToken in redux is expired
    // (currently it looks like the call to TwilioChatClient.create() fails with
    // an error window to the user)
    let cachedTwilioToken = store.getState().persist.user.twilioToken;
    if (cachedTwilioToken) {
      const clientReady = await this.initChatClient(cachedTwilioToken);
      if (clientReady) {
        return true;
      }
    }

    cachedTwilioToken = await this.getTwilioToken();
    if (cachedTwilioToken) {
      try {
        store.dispatch({
          type: 'SET_USER',
          data: {
            twilioToken: cachedTwilioToken
          }
        });
      } catch (e) {
        // TODO: add sentry
        // If we fail to set the local storage for the token, just continue processing
        // and we will attempt to cache the token again next time we refresh it
      }
      return this.initChatClient(cachedTwilioToken);
    }
    return false;
  }

  async getTwilioToken() {
    const requestUri = `${API_URL}/chat/token/${this.hmToken._id}?token=${this.hmToken.api_key}`;
    // TODO: add device ID
    const bodyData = { device: 'test' };
    try {
      const response = await fetch(
        requestUri,
        {
          method: 'post',
          body: JSON.stringify(bodyData),
          headers: { 'Content-Type': 'application/json' }
        }
      );
      const responseJson = await response.json();
      const twilioToken = responseJson.chat_token;
      return twilioToken;
    } catch (e) {
      // TODO: Add sentry logging
    }
    return false;
  }

  static async updateMessages(contact, channel, dispatch) {
    try {
      const messages = await channel.getMessages(MAX_MESSAGES_TO_LOAD);
      await MessageService.updateLocalMessageState(contact.id, messages, dispatch);
    } catch (e) {
      console.log('exception');
      console.log(e);
    }

    return [];

    /* const loadPrevPageFor = async (newMessages) => {
      const previousMessages = await newMessages.prevPage();
      previousMessages.loadPrevPage = () => loadPrevPageFor(previousMessages);
      this.messageService.updateLocalMessageState(contact, previousMessages);
    };
    messages.loadPrevPage = () => loadPrevPageFor(messages); */
    // await this.messageService.updateLocalMessageState(contact, messages);
  }

  async initChatClient(token) {
    try {
      const chatClient = await TwilioChatClient.create(token, { logLevel: 'info' });
      this.chatClient = chatClient;

      /* this.chatClient.on('tokenAboutToExpire', () => {
        this.getTwilioToken()
          .then(newData => this.chatClient.updateToken(newData))
          .catch(() => {
            // TODO: add sentry logging
          });
      }); */

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
