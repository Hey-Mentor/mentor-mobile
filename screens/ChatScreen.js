import React, { Component } from 'react';
import {
  View, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Image
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

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

  async componentDidMount() {
    console.log('Chat screen');

    /* this.setState({messages: []});

    const { state, navigate } = this.props.navigation;

    const token = await AsyncStorage.getItem('hm_token');
    console.log("HM Token:");
    console.log(token);

    this.setState({
      hmToken: token
    });

    //var channelData = await this.getSendBirdInfo(token, state.params.mentee._id);

    this.sendBirdApp = new SendBird({appId: Config.SENDBIRD_APP_ID })
    this.sendBirdApp.setErrorFirstCallback(true);

    console.log("SendBird Channel on main:");
    console.log(channelData.channel_url);

    console.log("User id");
    console.log(JSON.parse(token).user_id);

    this.sbData = {
      userId: JSON.parse(token).user_id,
      url: channelData.channel_url
    }

    // TODO error handling
    await new Promise(resolve => {
      this.sendBirdApp.connect(this.sbData.userId, resolve);
    });

    this.channel = await pify(this.sendBirdApp.GroupChannel.getChannel)(this.sbData.url);

    const channelHandler = new this.sendBirdApp.ChannelHandler();
    channelHandler.onMessageReceived = this.onReceive;
    this.sendBirdApp.addChannelHandler('ChatScreen');

    // Get previous messages
    const query = this.channel.createPreviousMessageListQuery();
    const messages = await new Promise(resolve => {
      query.load(30, false, (err, msgs) => {
        resolve(msgs);
      })
    })

    console.log("Map state");

    // Map them to GiftedChat format
    this.setState({
      messages: messages.map(m => {
        return {
          _id: m.messageId.toString(),
          text: m.message,
          createdAt: m.createdAt,
          user: {
            _id: m.sender.userId
          }
        }
      })
    });

    this.setState({ sendBirdApp: sendBirdApp });

    console.log("Done mapping state"); */
  }

  /* getTwilioToken = async (localToken, userId) => {
    console.log('Getting sendbird channel details');
    console.log(localToken);
    console.log(userId);
    const API_URL = 'http://ppeheymentor-env.qhsppj9piv.us-east-2.elasticbeanstalk.com';

    console.log(`${API_URL}/chat/${userId}?token=${localToken.api_key}`);

    const response = await fetch(
      `${API_URL}/chat/${localToken._id}?token=${localToken.api_key}&contactId=${userId}`
    );
    const responseJson = await response.json();

    console.log('Printing server results');
    console.log(responseJson);

    // Response should have .token and .channel
    const chatClient = new Twilio.Chat.Client(responseJson.token);

    currentChannel = '';
    chatClient.getSubscribedChannels().then((paginator) => {
      for (i = 0; i < paginator.items.length; i++) {
        const channel = paginator.items[i];
        console.log(`Channel: ${channel.friendlyName}`);
        console.log(`Channel: ${channel.uniqueName}`);
        if (channel.uniqueName == responseJson.channel) {
          currentChannel = channel;
        }
      }
    });
  }; */

  async onSend(messages = []) {
    const promises = messages.map(msg => new Promise((resolve) => {
      this.channel.sendUserMessage(msg.text, resolve);
    }));
    await Promise.all(promises);
    this.setState(previousState => ({
      messages: previousState.messages.concat(messages),
    }));
  }

  async onReceive(messages) {
    console.log('onReceive');
    this.setState(previousState => ({
      messages: previousState.messages.concat(messages),
    }));
    console.log('onReceive done');
  }

  render() {
    return (
      <View style={[styles.gcView]}>
        <GiftedChat
          inverted={false}
          messages={this.state && this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{ _id: this.sbData && this.sbData.userId }}
        />
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={80} />
      </View>
    );
  }
}

export default ChatScreen;
