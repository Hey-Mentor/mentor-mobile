import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';

import MenteeDetails from '../components/menteeDetails/MenteeDetails';

const MILLISEC_PER_DAY = 86400000;
const LOADING_DATA_TIMEOUT_SECS = 100;

class MenteeDetailsView extends Component {
  static navigationOptions = () => ({
    // title: {state.params.mentee.fname},
    headerTitleStyle: styles.headerTitleStyle
  });

  state = {
    messageDeltaString: '0 days',
    loading: true,
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
    } finally {
      // Timeout for a delayed animation
      // TODO: This should be removed when we are pulling data from Redux
      setTimeout(() => {
        this.setState({ loading: false });
      }, LOADING_DATA_TIMEOUT_SECS);
    }
  }

  render() {
    const { state } = this.props.navigation;
    return (
      <View>
        <MenteeDetails
          mentee={state.params.mentee}
          messageDelta={this.state.messageDeltaString}
        />
        <View style={styles.floatingView}>
          <ActivityIndicator
            animating={this.state.loading}
            size="large"
            color="#0000ff"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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

export default MenteeDetailsView;
