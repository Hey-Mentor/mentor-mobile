import React, { Component } from 'react';
import {
  View, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Image, AsyncStorage, YellowBox, ActivityIndicator
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { Client as TwilioChatClient } from 'twilio-chat';
import { CONFIG } from '../config.js';

YellowBox.ignoreWarnings(['Setting a timer for a long period', 'Deprecation warning: value provided is not in a recognized RFC2822']);

const avatarImage = require('../assets/img_avatar.png');

const API_URL = CONFIG.ENV === 'PROD' ? CONFIG.API_URL : CONFIG.TEST_API_URL;

const headerTitleStyle = {
  flex: 1,
  textAlign: 'center',
  color: '#000000',
  fontSize: 24,
  fontWeight: 'bold'
};

const styles = StyleSheet.create({
  headerImage: {
    borderRadius: 20,
    width: 40,
    height: 40,
    margin: 10,
    marginRight: 20
  },
  gcView: {
    flex: 1,
    paddingTop: 20
  }
});

class ChatScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.mentee.person.fname}`,
    headerTitleStyle,
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.navigate('menteeDetails', { mentee: navigation.state.params.mentee })}
      >
        <Image style={styles.headerImage} source={avatarImage} />
      </TouchableOpacity>

    )
  });

  state = {
    hmToken: {},
    messages: [],
    loading: true,
  };

  async componentDidMount() {
    const token = await AsyncStorage.getItem('hm_token');
    this.setState({
      hmToken: token
    });

    this.state.id = `${JSON.parse(token)._id}`;

    try {
      const twilioToken = await this.getTwilioToken();
      await this.initChatClient(twilioToken);
    } catch (e) {
      // TODO: add sentry logging
    }

    this.setState({ loading: false });

    // If we are the user who created the channel, always attempt to invite the other user
    //  We only want to do this if we created the channel, because any other user on the channel
    //   will not have permission to invite new users
    if (this.channel.createdBy === this.state.id) {
      this.tryInviteContact();
    }
  }

  async onSend(message) {
    try {
      const c = this.channel;
      c.sendMessage(message[0].text);
    } catch (e) {
      // TODO: add sentry logging
    }
  }

  async getChannelForChat(chatClient) {
    const channelName = this.getChannelName();
    return chatClient.getUserChannelDescriptors().then((paginator) => {
      // If this user has channels already, check if there is a channel
      // between current user and the user being messaged
      const channel = paginator.items.find(currentChannel => currentChannel.uniqueName === channelName);
      if (channel) {
        return channel.getChannel();
      }
      return this.createChannelWithUser(chatClient);
    });
  }

  async getTwilioToken() {
    const localToken = JSON.parse(this.state.hmToken);
    const requestUri = `${API_URL}/chat/token/${localToken._id}?token=${localToken.api_key}`;
    // TODO: add device ID
    const bodyData = { device: 'test' };
    const response = await fetch(requestUri, { method: 'post', body: JSON.stringify(bodyData), headers: { 'Content-Type': 'application/json' } });
    const responseJson = await response.json();
    const twilioToken = responseJson.chat_token;
    return twilioToken;
  }

  getChannelName() {
    const localToken = JSON.parse(this.state.hmToken);
    const contact = this.props.navigation.state.params.mentee._id;
    return localToken._id > contact ? `${localToken._id}.${contact}` : `${contact}.${localToken._id}`;
  }

  async getMessage() {
    try {
      const c = await this.channel;
      c.on('messageAdded', message => this.updateLocalMessageStateSingle(message));
      const messages = await c.getMessages();
      this.updateLocalMessageState(messages);
    } catch (e) {
      // TODO: add sentry logging
    }
  }

  tryInviteContact() {
    try {
      // TODO: if the user isn't found, or if the user trying to invite doesn't have permission, we still
      //  end up showing the error screen, and not catching the failure...
      this.channel.invite(this.props.navigation.state.params.mentee._id);
    } catch (e) {
      // TODO: add sentry logging
    }
  }

  async updateLocalMessageStateSingle(message) {
    const messages = {
      items: [message]
    };

    this.updateLocalMessageState(messages);
  }

  async updateLocalMessageState(messages) {
    const localMessages = messages.items.reverse().map(message => ({
      _id: `${message.index}`,
      text: `${message.body}`,
      createdAt: `${message.timestamp}`,
      user: {
        _id: `${message.author}`,
      },
    }));

    this.setState(previousState => ({
      messages: localMessages.concat(previousState.messages),
    }));

    this.cacheMessages();
  }

  async cacheMessages() {
    try {
      const localMessages = await AsyncStorage.getItem('messages');

      let localMessageDict = {};
      if (localMessages) {
        localMessageDict = JSON.parse(localMessages);
      }

      localMessageDict[this.props.navigation.state.params.mentee._id] = this.state.messages;
      await AsyncStorage.setItem('messages', JSON.stringify(localMessageDict));
    } catch (e) {
      // TODO: Add sentry logging
    }
  }

  async createChannelWithUser(chatClient) {
    const channelName = this.getChannelName();
    return chatClient.createChannel({
      uniqueName: channelName,
      friendlyName: channelName,
    });
  }

  async initChatClient(token) {
    try {
      const chatClient = await TwilioChatClient.create(token, { logLevel: 'info' });
      this.client = chatClient;

      this.client.on('tokenAboutToExpire', () => {
        this.getTwilioToken()
          .then(newData => this.client.updateToken(newData))
          .catch((err) => {
            // TODO: add sentry logging
          });
      });

      // Listen for new invitations to your Client
      this.client.on('channelInvited', (channel) => {
        // Join the channel that you were invited to
        // TODO: add a call to the backend to check if we should be joining this channel
        channel.join();
      });

      this.channel = await this.getChannelForChat(this.client);
      await this.getMessage();
      // TODO: Decide which of these callbacks we need
      // this.subscribeToAllChatClientEvents();
    } catch (e) {
      // TODO: add sentry logging
    }
  }

  async subscribeToAllChatClientEvents() {
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
  }

  renderBubble = props => (
    <Bubble
      {...props}
      textStyle={{
        left: {
          color: '#262626',
        },
        right: {
          color: '#262626',
        },
      }}
      wrapperStyle={{
        left: {
          backgroundColor: '#FFFFFF',
        },
        right: {
          backgroundColor: '#DCF8C6',
        },
      }}
    />
  );

  render() {
    const animating = this.state.loading;
    return (
      <View style={[styles.gcView]}>
        <ActivityIndicator animating={animating} />
        <GiftedChat
          scrollToBottom
          keyboardShouldPersistTaps="never"
          messages={this.state && this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{ _id: this.state.id }}
          renderBubble={this.renderBubble}
        />
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={80} />
      </View>
    );
  }
}

export default ChatScreen;
