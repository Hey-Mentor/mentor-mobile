import React, { Component } from 'react';
import MenteeDetails from '../components/menteeDetails/MenteeDetails';
import { Sentry } from 'react-native-sentry';

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

  render() {
    const { state } = this.props.navigation;
    return <MenteeDetails mentee={state.params.mentee} />;
  }
}

export default MenteeDetailsView;
