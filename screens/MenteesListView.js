import React, { Component } from 'react';

import {
  ScrollView,
  AsyncStorage,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import MenteeList from '../components/menteeList/MenteeList';
import { CONFIG } from '../config.js';
import { MessageBox } from '../components/common/MessageBox';
import PushNotificationService from '../services/pushNotificationService';

const API_URL = CONFIG.ENV === 'PROD' ? CONFIG.API_URL : CONFIG.TEST_API_URL;

class MenteeListView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.headerTitle}`,
    headerTitleStyle,
    headerLeft: null
    /* headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('notifications');
        }}
      >
        <BadgeIcon count={3}>
          <Icon
            name="ios-notifications"
            type="ionicon"
            size={35}
            iconStyle={styles.leftImage}
          />
        </BadgeIcon>
      </TouchableOpacity>
    ),

    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('settings');
        }}
      >
        <Icon
          name="gear"
          type="font-awesome"
          size={40}
          iconStyle={styles.rightImage}
        />
      </TouchableOpacity>

    ) */
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
      const profile = await this.getMyProfile(JSON.parse(this.state.hmToken)).catch((error) => {
        // TODO: Add sentry logs for error
        this.newErrorMessage('Uh-Oh', 'Failed to retrieve user information.');
      });
      this.constructContactItemsFromResponse(profile.contacts, JSON.parse(this.state.hmToken));
    } else {
      // TODO: Add sentry logs
    }





    //Testing PushNotification service
    this.PushNotificationService = new PushNotificationService();
    this.PushNotificationService.pushLocalNotification("Local notification", "Body");


    //
    this.setState({ loading: false });
  }

  getMyProfile = async (token) => {
    const response = await fetch(
      `${API_URL}/profile/${token._id}?token=${token.api_key}`
    );
    const responseJson = await response.json();
    return responseJson;
  };

  newErrorMessage = async (title, message) => {
    this.setState({
      messageBoxVisibile: true,
      messageBoxTitle: title,
      messageBoxText: message
    });
  };

  constructContactItemsFromResponse = async (contactIds, token) => {
    const contactItems = [];
    const requestString = `${API_URL}/contacts/${token._id}?token=${token.api_key}`;

    const responseObj = fetch(requestString)
      .then(
        (response) => {
          if (response.ok) {
            return response;
          }
          return Promise.reject(`Failed with status code: ${response.status}`);
        }
      );

    const responseBlob = responseObj
      .then(response => response.json());

    const contactData = responseBlob
      // TODO: Show "No mentees" error message on screen
      .then(responseJson => responseJson.contacts.map((contact) => {
        const fullName = `${contact.person.fname} ${contact.person.lname}`;
        return contactItems.push({
          name: fullName,
          school: contact.school.name,
          grade: contact.school.grade,
          id: contact._id,
          facebook_id: contact.facebook_id,
          fullContact: contact
        });
      }))
      .then(() => {
        // Fetch was successfull, but there were no contacts
        if (contactItems.length === 0) {
          // Display message to user
          this.newErrorMessage("Hmm, nobody's here", 'Get in touch with Hey Mentor to get paired with someone.');
        }
        return contactItems;
      })
      .catch((error) => {
        // TODO: add sentry logs
      });

    // Stop the loading indicator
    contactData.then(() => this.setState({ contactItem: contactItems }));
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
});

const headerTitleStyle = {
  flex: 1,
  textAlign: 'center',
  color: '#000000',
  fontSize: 24,
  fontWeight: 'bold',
  position: 'absolute',
  top: 0,
  left: 0,
};

export default MenteeListView;
