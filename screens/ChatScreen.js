import React, { Component } from 'react';
import {
  View, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Image, AsyncStorage
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Client as TwilioChatClient } from 'twilio-chat';

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

    const token = await AsyncStorage.getItem('hm_token');
    console.log('HM Token:');
    console.log(token);

    this.setState({
      hmToken: token
    });

    this.getTwilioToken().then((twilioToken) => {
      this.initChatClient(twilioToken).catch((error) => {
        console.log(error);
      });
    }).catch((error) => {
      console.log(error);
    });

    // this.setState({ twilioToken });    
  }

  async getTwilioToken() {
    console.log('Getting token data for Twilio');

    const API_URL = 'http://10.91.28.70:8081';

    console.log('HM Token from getTwilioToken: ');
    console.log(this.state.hmToken);
    const localToken = JSON.parse(this.state.hmToken);

    const requestUri = `${API_URL}/chat/token/${localToken._id}?token=${localToken.api_key}`;
    console.log(requestUri);

    const bodyData = { device: 'test' };

    const response = await fetch(requestUri, { method: 'post', body: JSON.stringify(bodyData), headers: { 'Content-Type': 'application/json' } });
    console.log(response);

    const responseJson = await response.json();

    console.log('Printing server results');
    console.log(responseJson);

    const twilioToken = responseJson.chat_token;
    return twilioToken;
  }

  async initChatClient(token) {
    console.log('initChatClient');
    console.log('Token:');
    console.log(token);

    TwilioChatClient.create(token, { logLevel: 'info' }).then((chatClient) => {
      this.client = chatClient;
      console.log('Created client...');
      this.client.on('tokenAboutToExpire', () => {
        this.getTwilioToken()
          .then(newData => this.client.updateToken(newData))
          .catch((err) => {
            console.log('login', 'can\'t get token', err);
          });
      });
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
