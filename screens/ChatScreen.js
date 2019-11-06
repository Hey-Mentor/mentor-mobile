import React, { Component } from 'react';
import {
  View, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Image, AsyncStorage, YellowBox, ActivityIndicator
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import TwilioService from '../services/twilioService';
import MessageBox from '../components/common/MessageBox';

YellowBox.ignoreWarnings(['Setting a timer for a long period', 'Deprecation warning: value provided is not in a recognized RFC2822']);

class ChatScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.mentee.person.fname}`,
    headerTitleStyle: styles.headerTitleStyle,
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.navigate('menteeDetails', { mentee: navigation.state.params.mentee })}
      >
        <Image style={styles.headerImage} source={{ uri: `https://graph.facebook.com/${navigation.state.params.mentee.facebook_id}/picture?type=large`, }} />
      </TouchableOpacity>

    )
  });

  state = {
    messages: [],
    contact: this.props.navigation.state.params.mentee._id,
    loading: true,
    id: null,
    messageBoxVisibile: false,
  };

  async componentDidMount() {
    const token = await AsyncStorage.getItem('hm_token');
    this.state.id = `${JSON.parse(token)._id}`;

    // Init Twilio service and message service
    this.newMessagesCallback = this.newMessagesCallback.bind(this);
    this.twilioService = new TwilioService(token, [this.state.contact], this.newMessagesCallback);

    // TODO: No messages and failed loading catches
    // See function afterLoading()
  }

  async onSend(message) {
    try {
      this.twilioService.sendMessage(this.state.contact, message[0].text);
    } catch (e) {
      // TODO: add sentry logging
    }
  }

  newMessagesCallback(newMessages) {
    this.setState(previousState => ({
      messages: newMessages.concat(previousState.messages),
    }));

    this.setState({ loading: false });
    this.afterLoading();
  }

  afterLoading() {
    if (this.state.messages.length === 0) {
      this.setState({
        messageBoxVisibile: true
      });
    }
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
        <View style={styles.floatingCenter}>
          <ActivityIndicator
            animating={animating}
            size="large"
            color="#0000ff"
          />
        </View>
        <View style={styles.floatingView}>
          <MessageBox
            title="It's Quiet in Here"
            text="Send a message to get the party started"
            visible={this.state.messageBoxVisibile}
          />
        </View>
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
    paddingTop: 0,
  },
  floatingCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  floatingView: {
    textAlign: 'center',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    margin: 10,
  },
  headerTitleStyle: {
    flex: 1,
    textAlign: 'center',
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold'
  },
});

export default ChatScreen;
