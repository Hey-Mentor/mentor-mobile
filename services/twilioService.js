import { Client as TwilioChatClient } from 'twilio-chat';
import { AsyncStorage, Alert} from 'react-native';
import CONFIG from '../config.js';
import MessageService from './messageService.js';
import { Paginator } from 'twilio-sync/lib/paginator';

const API_URL = CONFIG.ENV === 'PROD' ? CONFIG.API_URL : CONFIG.TEST_API_URL;

class TwilioService {
  constructor(hmToken, contacts, messagesCallback) {
    
    this.hmToken = hmToken;
    this.id = `${JSON.parse(hmToken)._id}`;

    this.chatClient = null;
    this.messageService = new MessageService(messagesCallback);

    // Map user_id to chat channel object
    this.channels = {};
    this.contacts = [contacts];

    this.startup(contacts);
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
    const channel = await this.getChannelForChat(contact);
    if (channel) {
      channel.on('messageAdded', message => this.messageService.updateLocalMessageStateSingle(contact, message));
      this.channels[contact] = channel;
    }
    return false;
  }



  async getChannelForChat(contact) {
    const channelName = this.getChannelName(contact);
    return this.chatClient.getPublicChannelDescriptors()
      .then((paginator) => {
        // If this user has channels already, check if there is a channel
        // between current user and the user being messaged
        console.log('Amount of channels: ' + paginator.items.length);
        for (i = 0; i < paginator.items.length; i++) {
          const channel = paginator.items[i];
          
          if (channel.uniqueName === channelName) {
            console.log("-            ---------------------- Channel already exist");
            return channel.getChannel();
          }
        }

        // const channel = paginator.items.find(currentChannel => {
        //   return currentChannel.uniqueName === channelName;
        // });

        console.log('No channel found. Creating channel with user: ')
        //return this.createChannelWithUser(contact);

        //Creating channel through the api
        return this.createChannelWithUserRequest(contact);
      });

    return this.chatClient
  }
  async createChannelWithUserRequest(contact) {
    const localToken = JSON.parse(this.hmToken);
    const requestUri = `${API_URL}/chat/channel/create/${localToken._id}?token=${localToken.api_key}`;


    // Adding the channelName to the body
    const channelName = this.getChannelName(contact);
    const bodyData = { channelName: channelName };
    try {
      const response = await fetch(requestUri, { method: 'post', body: JSON.stringify(bodyData), headers: { 'Content-Type': 'application/json' } });
      const responseJson = await response.json();
      const twilioToken = responseJson.status;
      return twilioToken;
    } catch (e) {
      // TODO: Add sentry logging
    }
  }

  async loadTwilioClient() {
    let localToken = await AsyncStorage.getItem('twilio_token');
    console.log('twilio_token: ' + localToken);

    if (localToken) {
      const clientReady = await this.initChatClient(localToken);
      if (clientReady) {
        return true;
      }
    }

    localToken = await this.getTwilioToken();
    if (localToken) {
      try {
        await AsyncStorage.setItem('twilio_token', localToken);
      } catch (e) {
        // TODO: add sentry
        // If we fail to set the local storage for the token, just continue processing
        //  and we will attempt to cache the token again next time we refresh it
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
    console.log(localToken._id > contact ? `${localToken._id}.${contact}` : `${contact}.${localToken._id}`);
    return localToken._id > contact ? `${localToken._id}.${contact}` : `${contact}.${localToken._id}`;
  }

  async updateMessages(contact) {
    const messages = await this.getRawMessages(contact);
    await this.messageService.updateLocalMessageState(contact, messages);
  }

  async getRawMessages(contact) {
    try {
      const c = await this.channels[contact];
      return c.getMessages();
    } catch (e) {
      // TODO: add sentry logging
    }
    return null;
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



      // TODO: Decide which of these callbacks we need
      this.subscribeToAllChatClientEvents();
      return true;
    } catch (e) {
      // TODO: add sentry logging
      return false;
    }
  }


  async subscribeToAllChatClientEvents() {

    // Listen for new invitations to your Client
    this.chatClient.on('channelInvited', (channel) => {
      console.log('You have been invited to join the channel: ', channel.friendlyName)

      // Works on both iOS and Android
      Alert.alert(
        'Channel invitation',
        'You have been invited to join the channel: ' + channel.friendlyName,
        [
          { text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => {
            console.log('OK Pressed') ;

            // Join the channel that you were invited to
            channel.join();
          }},
        ],
        { cancelable: false },
      );
      // TODO: add a call to the backend to check if we should be joining this channel
    });


    // TODO: Ensure that all webooks from this doc are included:
    // https://www.twilio.com/docs/chat/webhook-events

    // This function is not currently called. We should decide which callbacks we want to handle, and how
    // this.client.on('tokenAboutToExpire', obj => console.log('ChatClientHelper.client', 'tokenAboutToExpire', obj));
    // this.client.on('tokenExpired', obj => console.log('ChatClientHelper.client', 'tokenExpired', obj));

    // this.client.on('userSubscribed', obj => console.log('ChatClientHelper.client', 'userSubscribed', obj));
    // this.client.on('userUpdated', obj => console.log('ChatClientHelper.client', 'userUpdated', obj));
    // this.client.on('userUnsubscribed', obj => console.log('ChatClientHelper.client', 'userUnsubscribed', obj));

    // this.client.on('channelAdded', obj => console.log('ChatClientHelper.client', 'channelAdded', obj));
    // this.client.on('channelRemoved', obj => console.log('ChatClientHelper.client', 'channelRemoved', obj));
    // this.client.on('channelInvited', obj => console.log('ChatClientHelper.client', 'channelInvited', obj));
    // this.client.on('channelJoined', obj => console.log('ChatClientHelper.client', 'channelJoined', obj));
    // this.client.on('channelLeft', obj => console.log('ChatClientHelper.client', 'channelLeft', obj));
    // this.client.on('channelUpdated', obj => console.log('ChatClientHelper.client', 'channelUpdated', obj));

    // this.client.on('memberJoined', obj => console.log('ChatClientHelper.client', 'memberJoined', obj));
    // this.client.on('memberLeft', obj => console.log('ChatClientHelper.client', 'memberLeft', obj));
    // this.client.on('memberUpdated', obj => console.log('ChatClientHelper.client', 'memberUpdated', obj));

    // this.client.on('messageAdded', obj => console.log('ChatClientHelper.client', 'messageAdded', obj));
    // this.client.on('messageUpdated', obj => console.log('ChatClientHelper.client', 'messageUpdated', obj));
    // this.client.on('messageRemoved', obj => console.log('ChatClientHelper.client', 'messageRemoved', obj));

    // this.client.on('typingStarted', obj => console.log('ChatClientHelper.client', 'typingStarted', obj));
    // this.client.on('typingEnded', obj => console.log('ChatClientHelper.client', 'typingEnded', obj));

    // this.client.on('connectionStateChanged', obj => console.log('ChatClientHelper.client', 'connectionStateChanged', obj));
    // this.client.on('pushNotification', obj => console.log('ChatClientHelper.client', 'onPushNotification', obj));
  }
}

export default TwilioService;
