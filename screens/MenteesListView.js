import React, { Component } from 'react';
import {
  ScrollView,
  AsyncStorage
} from 'react-native';
import MenteeList from '../components/menteeList/MenteeList';
import { API_URL } from '../config.js';

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
    hmToken: ''
  };

  async componentDidMount() {
    const token = await AsyncStorage.getItem('hm_token');

    this.setState({
      hmToken: token
    });

    // this.getUserData(this.state.fbUserId, this.state.fbToken);
    if (this.state.hmToken) {
      const profile = await this.getMyProfile(JSON.parse(this.state.hmToken));
      this.constructContactItemsFromResponse(profile.contacts, JSON.parse(this.state.hmToken));
    } else {
      // TODO: Add sentry logs
    }
  }

  getMyProfile = async (token) => {
    const response = await fetch(
      `${API_URL}/profile/${token._id}?token=${token.api_key}`
    );
    const responseJson = await response.json();
    return responseJson;
  };

  constructContactItemsFromResponse = async (contactIds, token) => {
    const contactItems = [];
    const requestString = `${API_URL}/contacts/${token._id}?token=${token.api_key}`;
    const contactData = fetch(requestString)
      .then(response => response.json())
      .catch((error) => {
        // TODO: Add sentry logs
      })
      // TODO: Show "No mentees" error message on screen
      .then(responseJson => responseJson.contacts.map((contact) => {
        const fullName = `${contact.person.fname} ${contact.person.lname}`;
        return contactItems.push({
          name: fullName,
          school: contact.school.name,
          grade: contact.school.grade,
          id: contact._id,
          fullContact: contact
        });
      }))
      .catch((error) => {
        // TODO: add sentry logs
      });

    contactData.then(() => this.setState({ contactItem: contactItems }));
  };

  render() {
    return (
      <ScrollView>
        <MenteeList
          menteeItem={this.state.contactItem}
          navigation={this.props.navigation}
        />
      </ScrollView>
    );
  }
}

const headerTitleStyle = {
  flex: 1,
  textAlign: 'center',
  color: '#000000',
  fontSize: 24,
  fontWeight: 'bold'
};

export default MenteeListView;
