import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Toast } from 'native-base';
import {
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
} from 'react-native';

import MenteeList from '../components/menteeList/MenteeList';
import { constructContactItemsWithToken } from '../actions';

class MenteeListView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.headerTitle}`,
    headerTitleStyle: styles.headerTitleStyle,
    headerLeft: () => null
  });

  state = {};

  async componentDidMount() {
    this.props.dispatch(constructContactItemsWithToken(this.props.user.hmToken));
  }

  componentDidUpdate() {
    if (this.props.errors) {
      this.props.errors.forEach((error) => {
        this.props.dispatch({
          type: 'CLEAR_ERROR',
          data: error
        });
        Toast.show({
          text: error.text,
          buttonText: 'Okay',
          duration: 10000
        });
      });
    }
  }

  render() {
    return (
      <View style={styles.contentWrap}>
        <ScrollView
          refreshControl={(
            <RefreshControl
              refreshing={this.props.refreshingContacts}
              onRefresh={() => {
                this.props.dispatch(constructContactItemsWithToken(this.props.user.hmToken));
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
  },
});

export default connect(state => ({
  user: state.persist.user,
  errors: state.general.errors,
  contactItem: state.persist.contactsList.items,
  refreshingContacts: state.persist.contactsList.refreshing
}))(MenteeListView);
