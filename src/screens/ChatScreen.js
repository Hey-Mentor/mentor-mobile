import React, { Component } from 'react';
import {
  View, StyleSheet, KeyboardAvoidingView, YellowBox, ActivityIndicator, Platform
} from 'react-native';
import { connect } from 'react-redux';
import { Avatar } from 'react-native-elements';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import TwilioService from '../services/twilioService';
import MessageBox from '../components/common/MessageBox';
import { Routes } from '../constants';

YellowBox.ignoreWarnings(['Setting a timer for a long period', 'Deprecation warning: value provided is not in a recognized RFC2822']);

class ChatScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.mentee.person.fname}`,
    headerTitleStyle: styles.headerTitleStyle,
    headerRight: () => (
      <Avatar
        onPress={() => navigation.navigate(Routes.MENTEE_DETAILS, { mentee: navigation.state.params.mentee })}
        containerStyle={{ marginRight: 10 }}
        rounded
        source={{ uri: `https://graph.facebook.com/${navigation.state.params.mentee.facebook_id}/picture?type=large` }}
      />
    )
  });

  state = {
    messages: [],
    contact: this.props.navigation.state.params.mentee._id,
    loading: true,
    id: null,
    messageBoxVisibile: false,
    hasPrevPage: false,
    isLoadingPrev: false,
    loadPrevPage: () => {},
    typing: false
  };

  async componentDidMount() {
    const { hmToken } = this.props.user;
    this.state.id = `${hmToken._id}`;

    // Init Twilio service and message service
    this.typingCallback = this.typingCallback.bind(this);
    this.newMessagesCallback = this.newMessagesCallback.bind(this);
    this.twilioService = new TwilioService(JSON.stringify(hmToken), [this.state.contact], this.newMessagesCallback, this.typingCallback);

    // TODO: No messages and failed loading catches
    // See function afterLoading()
  }

  componentWillUnmount() {
    this.twilioService.chatClient.shutdown();
  }

  async onSend(message) {
    try {
      this.twilioService.sendMessage(this.state.contact, message[0].text);
    } catch (e) {
      // TODO: add sentry logging
    }
  }

  async onTyping(evt) {
    try {
      if (evt && this.state.contact) {
        this.twilioService.userTyping(this.state.contact);
      }
    } catch (e) {
      // console.error(e);
    }
  }

  newMessagesCallback(newMessages) {
    const { items, hasPrevPage, loadPrevPage } = newMessages;
    this.setState(previousState => ({
      messages: items.concat(previousState.messages),
      hasPrevPage,
      loadPrevPage: () => {
        this.setState({ isLoadingPrev: true });
        loadPrevPage();
      },
      isLoadingPrev: false
    }), () => console.log(this.state.messages));

    this.setState({ loading: false });
    this.afterLoading();
  }

  typingCallback(member) {
    console.log(`${member} is typing???`);
    // if (!this.state.typing) {
    //   this.setState({ typing: true });
    // }
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
          color: '#222222',
        },
        right: {
          color: '#222222',
        },
      }}
      wrapperStyle={{
        left: {
          backgroundColor: '#FFFFFF',
        },
        right: {
          backgroundColor: '#D9F0F9',
        },
      }}
    />
  );

  render() {
    const {
      loading, hasPrevPage, isLoadingPrev, loadPrevPage
    } = this.state;
    return (
      <View style={[styles.gcView]}>
        {loading && (
        <View style={styles.floatingCenter}>
          <ActivityIndicator
            animating={loading}
            size="large"
            color="#0000ff"
          />
        </View>
        )}
        {this.state.messageBoxVisibile && (
        <View style={styles.floatingView}>
          <MessageBox
            title="It's Quiet in Here"
            text="Send a message to get the party started"
            visible={this.state.messageBoxVisibile}
          />
        </View>
        )}
        <GiftedChat
          loadEarlier={hasPrevPage}
          onLoadEarlier={loadPrevPage}
          isLoadingEarlier={isLoadingPrev}
          scrollToBottom
          keyboardShouldPersistTaps="never"
          messages={this.state && this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{ _id: this.state.id }}
          renderBubble={this.renderBubble}
          onInputTextChanged={(evt) => this.onTyping(evt)}
          isTyping={this.state.typing}
          // renderFooter={}
        />
        {
          Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={80} />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
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

export default connect(state => ({
  user: state.persist.user,
  errors: state.general.errors,
}))(ChatScreen);
