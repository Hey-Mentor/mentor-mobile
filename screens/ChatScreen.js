import React, { Component } from 'react';
import {
  View, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Image, AsyncStorage
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { Client as TwilioChatClient } from 'twilio-chat';
import { API_URL } from '../config.js';

const avatarImage = require('../assets/img_avatar.png');

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
  };

  async componentDidMount() {
    console.log('Chat screen');

    const token = await AsyncStorage.getItem('hm_token');
    this.setState({
      hmToken: token
    });

    this.state.id = `${JSON.parse(token)._id}`;

    this.getTwilioToken().then((twilioToken) => {
      this.initChatClient(twilioToken).catch((error) => {
        console.log(error);
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  async onSend(message) {
    this.channel.then((c) => {
      c.sendMessage(message[0].text);
    });
  }

  async getChannelForChat(chatClient) {
    console.log('Getting user channel descriptors...');
    const channelName = this.getChannelName();

    return chatClient.getUserChannelDescriptors().then((paginator) => {
      // If this user has channels already, check if there is a channel
      // between current user and the user being messaged
      for (let i = 0; i < paginator.items.length; i += 1) {
        const channel = paginator.items[i];
        console.log(`Channel: ${channel.friendlyName}`);
        if (channel.uniqueName === channelName) {
          console.log(`Found correct channel: ${channel.uniqueName}`);
          return channel.getChannel();
        }
      }

      return this.createChannelWithUser(chatClient);
    });
  }

  async getTwilioToken() {
    console.log('Getting token data for Twilio');

    const localToken = JSON.parse(this.state.hmToken);
    const requestUri = `${API_URL}/chat/token/${localToken._id}?token=${localToken.api_key}`;
    console.log(requestUri);

    // TODO: add device ID
    const bodyData = { device: 'test' };
    const response = await fetch(requestUri, { method: 'post', body: JSON.stringify(bodyData), headers: { 'Content-Type': 'application/json' } });
    const responseJson = await response.json();

    console.log('Printing server results');
    console.log(responseJson);

    const twilioToken = responseJson.chat_token;
    return twilioToken;
  }

  getChannelName() {
    const localToken = JSON.parse(this.state.hmToken);
    const contact = this.props.navigation.state.params.mentee._id;
    return localToken._id > contact ? `${localToken._id}.${contact}` : `${contact}.${localToken._id}`;
  }

  async getMessage() {
    this.channel.then((c) => {
      c.on('messageAdded', message => this.updateLocalMessageStateSingle(message));

      c.getMessages().then((messages) => {
        const totalMessages = messages.items.length;
        const localMessages = [];

        for (let i = 0; i < totalMessages; i += 1) {
          const message = messages.items[i];
          const currMessage = {
            _id: `${message.index}`,
            text: `${message.body}`,
            createdAt: `${message.timestamp}`,
            user: {
              _id: `${message.author}`,
            },
          };

          localMessages.push(currMessage);
        }

        this.setState(previousState => ({
          messages: previousState.messages.concat(localMessages),
        }));
      });
    });
  }

  async updateLocalMessageStateSingle(message) {
    const messages = {
      items: [message]
    };

    this.updateLocalMessageState(messages);
  }

  async updateLocalMessageState(messages) {
    const totalMessages = messages.items.length;
    const localMessages = [];

    for (let i = 0; i < totalMessages; i += 1) {
      const message = messages.items[i];
      const currMessage = {
        _id: `${message.index}`,
        text: `${message.body}`,
        createdAt: `${message.timestamp}`,
        user: {
          _id: `${message.author}`,
        },
      };

      localMessages.push(currMessage);
    }

    this.setState(previousState => ({
      messages: previousState.messages.concat(localMessages),
    }));
  }

  async createChannelWithUser(chatClient) {
    console.log('Creating channel...');

    const user = this.props.navigation.state.params.mentee._id;
    // Sort the IDs so that we have a deterministic order
    const channelName = this.getChannelName();
    return chatClient.createChannel({
      uniqueName: channelName,
      friendlyName: channelName,
    }).then((channel) => {
      console.log('Created channel');
      channel.join().catch((err) => {
        console.error(
          `Couldn't join channel ${channel.friendlyName} because ${err}`
        );
      });

      // Invite other user to your channel
      channel.invite(user).then(() => {
        console.log('Your friend has been invited!');
      }).catch((error) => {
        console.log(`Couldn't invite user: ${error}`);
      });
    }).catch((error) => {
      console.log(`Error in creating channel: ${error}`);
    });
  }

  async initChatClient(token) {
    console.log('initChatClient');

    TwilioChatClient.create(token, { logLevel: 'info' }).then((chatClient) => {
      this.client = chatClient;

      this.client.on('tokenAboutToExpire', () => {
        this.getTwilioToken()
          .then(newData => this.client.updateToken(newData))
          .catch((err) => {
            console.log(`Error getting token on refresh: ${err}`);
          });
      });

      // Listen for new invitations to your Client
      this.client.on('channelInvited', (channel) => {
        console.log(`Invited to channel ${channel.friendlyName}`);
        // Join the channel that you were invited to
        // TODO: add a call to the backend to check if we should be joining this channel
        console.log('Joining channel');
        channel.join();
      });

      this.client.on('channelJoined', (channel) => {
        console.log(`Joined channel ${channel.friendlyName}`);
      });

      this.channel = this.getChannelForChat(this.client);
      this.getMessage();
      // this.subscribeToAllChatClientEvents(); TODO: getting logging failures here
    }).catch((error) => {
      console.log('Error while trying to create Twilio client');
      console.log(error);
    });
  }

  async subscribeToAllChatClientEvents() {
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
    console.log('Finished subscribing to all Twilio events');
  }

  renderBubble = props => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: '#c3c1f9',
        },
        right: {
          backgroundColor: '#98f0ab',
        },
      }}
    />
  );

  render() {
    return (
      <View style={[styles.gcView]}>
        <GiftedChat
          inverted={false}
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
