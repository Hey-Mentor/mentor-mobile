import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  AsyncStorage,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import MenteeList from '../components/menteeList/MenteeList';
import { constructContactItemsWithToken } from '../actions';

class MenteeListView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.headerTitle}`,
    headerTitleStyle: styles.headerTitleStyle,
    headerLeft: null
  });

  state = {
    hmToken: '',
    loading: true,
  };

  async componentDidMount() {
    this.setState({ loading: true });

    // Get token from storage
    const token = await AsyncStorage.getItem('hm_token');
    this.setState({ hmToken: token });

    if (this.state.hmToken) {
      this.props.dispatch(constructContactItemsWithToken(JSON.parse(this.state.hmToken)));
    } else {
      // TODO: Add sentry logs
    }

    this.setState({ loading: false });
  }

  render() {
    return (
      <View style={styles.contentWrap}>
        <View style={styles.floatingView}>
          <ActivityIndicator
            animating={this.state.loading}
            size="large"
            color="#0000ff"
          />
        </View>
        <ScrollView
          refreshControl={(
            <RefreshControl
              refreshing={this.props.refreshingContacts}
              onRefresh={() => {
                this.props.dispatch(constructContactItemsWithToken(JSON.parse(this.state.hmToken)));
              }}
            />
          )}
        >
          <MenteeList
            menteeItem={this.props.contactItem}
            navigation={this.props.navigation}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  floatingView: {
    position: 'absolute',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    flex: 1,
    margin: 30,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerTitleStyle: {
    flex: 1,
    textAlign: 'center',
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default connect(state => ({
  contactItem: state.user.contactItem,
  refreshingContacts: state.user.refreshingContacts
}))(MenteeListView);
