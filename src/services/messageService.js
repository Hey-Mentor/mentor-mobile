
class MessageService {
  constructor() {
    this.messages = {};
  }

  static async cacheMessages(contactId, messages, dispatch) {
    try {
      const localMessages = {}; // this.props.messages;
      if (!localMessages[contactId]) {
        localMessages[contactId] = [];
      }
      // localMessages[contactId] = [...messages, ...localMessages[contactId]];
      localMessages[contactId] = messages;
      dispatch({
        type: 'SET_MESSAGES',
        data: localMessages
      });
    } catch (e) {
      console.log(e);
      // TODO: Add sentry logging
    }
  }

  async updateLocalMessageStateSingle(contact, message) {
    this.updateLocalMessageState(contact, { items: [message] });
  }

  static async updateLocalMessageState(contactId, rawMessages, dispatch) {
    const messages = MessageService.formatRawMessages(rawMessages);
    MessageService.cacheMessages(contactId, messages, dispatch);
  }

  static formatRawMessages(rawMessages) {
    const { items, ...otherProps } = rawMessages;
    return {
      items: items.map(message => ({
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
