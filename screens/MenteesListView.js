import React, { Component } from 'react';

import {
  ScrollView,
  AsyncStorage,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Toast } from 'native-base';

import MenteeList from '../components/menteeList/MenteeList';
import CONFIG from '../config.js';
import MessageBox from '../components/common/MessageBox';

const API_URL = CONFIG.ENV === 'PROD' ? CONFIG.API_URL : CONFIG.TEST_API_URL;

class MenteeListView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.headerTitle}`,
    headerTitleStyle: styles.headerTitleStyle,
    headerLeft: null
  });

  state = {
    contactItem: [],
    hmToken: '',
    loading: true,
    messageBoxVisibile: false,
    refreshing: false,
  };

  async componentDidMount() {
    this.setState({ loading: true });

    // Get token from storage
    const token = await AsyncStorage.getItem('hm_token');
    this.setState({ hmToken: token });

    if (this.state.hmToken) {
      this.constructContactItemsWithToken(JSON.parse(this.state.hmToken));
    } else {
      // TODO: Add sentry logs
    }

    this.setState({ loading: false });
  }

  newErrorMessage = async (title, message) => {
    this.setState({
      messageBoxVisibile: true,
      messageBoxTitle: title,
      messageBoxText: message
    });
  };

  constructContactItemsWithToken = async (token) => {
    try {
      const response = await fetch(`${API_URL}/contacts/${token._id}?token=${token.api_key}`);
      if (!response.ok) {
        throw new Error(`Failed with status code: ${response.status}`);
      }
      const contactData = (await response.json()).contacts.map(contact => ({
        name: `${contact.person.fname} ${contact.person.lname}`,
        school: contact.school.name,
        grade: contact.school.grade,
        id: contact._id,
        facebook_id: contact.facebook_id,
        fullContact: contact
      }));
      if (contactData.length === 0) {
        this.newErrorMessage("Hmm, nobody's here", 'Get in touch with Hey Mentor to get paired with someone.');
      }
      this.setState({ contactItem: contactData });
    } catch (err) {
      Toast.show({
        text: `${err}`,
        buttonText: 'Okay'
      });
    }
  };

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
              refreshing={this.state.refreshing}
              onRefresh={() => {
                // Removing old data
                this.setState({
                  refreshing: true,
                  contactItem: []
                });

                this.state.messageBoxVisibile = false;

                // Reload page
                this.componentDidMount();
                this.setState({ refreshing: false });
              }}
            />
          )}
        >
          {/* No content messages */}
          <MessageBox
            title={this.state.messageBoxTitle}
            text={this.state.messageBoxText}
            visible={this.state.messageBoxVisibile}
          />
          <MenteeList
            menteeItem={this.state.contactItem}
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

export default MenteeListView;
