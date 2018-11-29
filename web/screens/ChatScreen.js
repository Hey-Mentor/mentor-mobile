import React, { Component } from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import SendBird from 'sendbird';
import pify from 'pify';
import { GiftedChat } from 'react-native-gifted-chat'

// TODO: create channel elsewhere (on user create?)
// this.channel = await pify(sb.GroupChannel.createChannelWithUserIds)(['ace'], false);

class ChatScreen extends Component {
  async componentDidMount () {
    this.setState({messages: []});

    const {navigation} = this.props;

    const sb = new SendBird({appId: 'YOUR_APP_ID' })
    sb.setErrorFirstCallback(true);

    // TODO: specify these params in the "navigate" function
    this.sb = {
      userId: navigation.getParam('sbUser') || 'ace',
      url: navigation.getParam('sbUrl') || 'sendbird_group_channel_68129982_a41c6a73810a7e53dde6285f6e486905c9bd77f5'
    }

    // TODO error handling
    await new Promise(resolve => {
      sb.connect(this.sb.userId, resolve);
    });

    // TODO: get channel URL (from DB?)
    const url = 
    //const url = 'sendbird_open_channel_39768_d7f170bf85607da04df4add2c574af3557543ab3';
    //const url = '';
    this.channel = await pify(sb.GroupChannel.getChannel)(this.sb.url);

    const channelHandler = new sb.ChannelHandler();
    channelHandler.onMessageReceived = onReceive;
    sb.addChannelHandler('ChatScreen');

    // Get previous messages
    const query = this.channel.createPreviousMessageListQuery();
    const messages = await new Promise(resolve => {
      query.load(30, false, (err, msgs) => {
        resolve(msgs);
      })
    })

    // Map them to GiftedChat format
    this.setState({
      messages: messages.map(m => {
        return {
          _id: m.messageId,
          text: m.message,
          createdAt: m.createdAt,
          user: {
            avatar: m.sender.profileUrl,
            _id: m.sender.userId
          }
        }
      })
    });
  };

  async componentWillUnmount() {
    sb.RemoveChannelHandler('ChatScreen');
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
    this.setState(previousState => ({
      messages: previousState.messages.concat(messages),
    }))
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
          inverted={true}
          messages={this.state && this.state.messages}
          onSend={messages => this.onSend(messages)}
          onReceive={messages => this.onReceive(messages)}
          user={{_id: this.sb && this.sb.userId}} />
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={80} />
    </View>;
  }
}

export default ChatScreen;