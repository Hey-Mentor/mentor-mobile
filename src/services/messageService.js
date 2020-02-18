import store from '../redux/store';

class MessageService {
  constructor(newMessagesCallback) {
    this.messages = {};
    this.newMessagesCallback = newMessagesCallback;
  }

  static async cacheMessages(contact, messages) {
    try {
      const localMessages = store.getState().persist.messages;
      if (!localMessages[contact.id]) {
        localMessages[contact.id] = [];
      }
      localMessages[contact.id] = [...messages, ...localMessages[contact.id]];
      store.dispatch({
        type: 'SET_MESSAGES',
        data: localMessages
      });
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
    const { items, ...otherProps } = rawMessages;
    return {
      items: items.reverse().map(message => ({
        _id: `${message.index}`,
        text: `${message.body}`,
        createdAt: `${message.timestamp}`,
        user: {
          _id: `${message.author}`,
        },
      })),
      ...otherProps
    };
  }
}

export default MessageService;
