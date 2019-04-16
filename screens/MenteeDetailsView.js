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
        console.log(messageContext);
        console.log(`${this.props.navigation.state.params.mentee._id}`);
        const messageArray = messageContext[this.props.navigation.state.params.mentee._id];
        console.log('array');
        console.log(messageArray);
        console.log('done array');
        const messageDelta = Math.round(Math.abs(Date.now() - Date.parse(messageArray[0].createdAt)) / 86400000);
        if (messageDelta === 1) {
          this.setState({ messageDeltaString: '1 day' });
        } else {
          this.setState({ messageDeltaString: `${messageDelta} days` });
        }
      }
    } catch (e) {
      // TODO: add sentry logging
      console.error(e);
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
