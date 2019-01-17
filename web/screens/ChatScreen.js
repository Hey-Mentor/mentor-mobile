import React, { Component } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, AsyncStorage, TouchableOpacity, Image } from 'react-native';
import SendBird from 'sendbird';
import pify from 'pify';
import { GiftedChat } from 'react-native-gifted-chat';
import base64 from 'react-native-base64';
import Config from 'react-native-config';

// TODO: create channel elsewhere (on user create?)
// this.channel = await pify(sb.GroupChannel.createChannelWithUserIds)(['ace'], false);

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
  }
});

class ChatScreen extends Component {
  state = { sendBirdApp: null };

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.mentee.person.fname}`,  
    headerTitleStyle,
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.navigate('menteeDetails', {mentee: navigation.state.params.mentee})}
      >
        <Image style={styles.headerImage} source={require('../assets/img_avatar.png')} />
      </TouchableOpacity>

    )
  });

  async componentDidMount () {

    console.log("Chat screen");

    this.setState({messages: []});

    const { state, navigate } = this.props.navigation;

    const token = await AsyncStorage.getItem('hm_token');
    console.log("HM Token:");
    console.log(token);

    let encoded = base64.encode(token);

    this.setState({
      hmToken: token,
      hmEncoded: encoded
    });

    var channelData = await this.getSendBirdInfo(encoded, state.params.mentee.user_id);

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

    console.log("Done mapping state");
  };

  getSendBirdInfo = async(token, userId) => {
    console.log("Getting sendbird channel details");
    console.log(token);
    console.log(userId);

    let response = await fetch(
      `${Config.API_URL}/messages/${userId}/${token}`
    );
    
    let responseJson = await response.json();

    console.log("Printing getSendbird results");
    console.log(responseJson);

    return responseJson;
  };


  async componentWillUnmount() {
    this.state.sendBirdApp.RemoveChannelHandler('ChatScreen');
  }

  async onSend(messages = []) {
    const promises = messages.map(msg => {
      return new Promise(resolve => {
        this.channel.sendUserMessage(msg.text, resolve);
      });
    });
    await Promise.all(promises);
    this.setState(previousState => ({
      messages: previousState.messages.concat(messages),
    }))
  }

  async onReceive(channel, messages) {
    console.log("onReceive");
    this.setState(previousState => ({
      messages: previousState.messages.concat(messages),
    }))
    console.log("onReceive done");
  }

  render() {
    const styles = StyleSheet.create({
      gcView: {
        flex: 1,
        paddingTop: 20
      }
    });

    return <View style={[styles.gcView]}>
      <GiftedChat
          inverted={false}
          messages={this.state && this.state.messages}
          onSend={messages => this.onSend(messages)}
          onReceive={messages => this.onReceive(messages)}
          user={{_id: this.sbData && this.sbData.userId}} />
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={80} />
    </View>;
  }
}

export default ChatScreen;