import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import MenteeDetails from '../components/menteeDetails/MenteeDetails';

const headerTitleStyle = {
  flex: 1,
  textAlign: 'center',
  color: '#000000',
  fontSize: 24,
  fontWeight: 'bold'
};

const MILLISEC_PER_DAY = 86400000;

class MenteeDetailsView extends Component {
  static navigationOptions = () => ({
    // title: {state.params.mentee.fname},
    headerTitleStyle
  });

  state = {
    messageDeltaString: '0 days'
  };

  async componentDidMount() {
    try {
      const messageContextJson = await AsyncStorage.getItem('messages');
      if (messageContextJson) {
        const messageContext = JSON.parse(messageContextJson);
        const menteeId = this.props.navigation.state.params.mentee._id;
        if (messageContext && menteeId in messageContext) {
          const messageArray = messageContext[this.props.navigation.state.params.mentee._id];
          if (messageArray) {
            const messageDelta = Math.round(Math.abs(Date.now() - Date.parse(messageArray[0].createdAt)) / MILLISEC_PER_DAY);
            this.setState({ messageDeltaString: `${messageDelta} ${messageDelta === 1 ? 'day' : 'days'}` });
          }
        }
      }
    } catch (e) {
      // TODO: add sentry logging
    }
  }

  render() {
    const { state } = this.props.navigation;
    return (
      <MenteeDetails
        mentee={state.params.mentee}
        messageDelta={this.state.messageDeltaString}
      />
    );
  }
}

export default MenteeDetailsView;
