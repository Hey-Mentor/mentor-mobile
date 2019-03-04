import React, { Component } from 'react';
import {
  View, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Image, AsyncStorage
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

    const token = await AsyncStorage.getItem('hm_token');
    console.log('HM Token:');
    console.log(token);

    this.setState({
      hmToken: token
    });

    const twilioToken = this.getTwilioToken()
      .catch((error) => {
        console.log(error);
        this.setState({
          // messages: [...this.state.messages, { body: `Error: ${error.message}` }],
        });
      });

    // this.setState({ twilioToken });

    this.initChatClient(twilioToken);
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

  /*async initChatClient(token) {
    const accessManager = new AccessManager(token);
    const client = new Client(token);

    // specify any handlers for events
    accessManager.onTokenWillExpire = () => {
      this.getTwilioToken().then(accessManager.updateToken);
    };

    client.onError = ({ error }) => console.log(error);
    client.initialize();

    // wait for sync to finish
    client.onClientSynchronized = () => {
      client.getUserChannels().then((channelPaginator) => console.log(channelPaginator.items));
    };
  }*/

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
