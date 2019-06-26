import { AsyncStorage } from 'react-native';

class MessageService {
  constructor(newMessagesCallback) {
    this.messages = {};
    this.newMessagesCallback = newMessagesCallback;
  }

  static async cacheMessages(contact, messages) {
    try {
      const localMessages = await AsyncStorage.getItem('messages');

      let localMessageDict = {};
      if (localMessages) {
        localMessageDict = JSON.parse(localMessages);
      }

      localMessageDict[contact] = messages;
      await AsyncStorage.setItem('messages', JSON.stringify(localMessageDict));
    } catch (e) {
      // TODO: Add sentry logging
    }
  }

  async updateLocalMessageStateSingle(contact, message) {
    this.updateLocalMessageState(contact, { items: [message] });
  }

  async updateLocalMessageState(contact, rawMessages) {
    const messages = MessageService.formatRawMessages(rawMessages);
    this.newMessagesCallback(messages);
    MessageService.cacheMessages(contact, messages);
  }

  static formatRawMessages(rawMessages) {
    return rawMessages.items.reverse().map(message => ({
      _id: `${message.index}`,
      text: `${message.body}`,
      createdAt: `${message.timestamp}`,
      user: {
        _id: `${message.author}`,
      },
    }));
  }
}

export default MessageService;
