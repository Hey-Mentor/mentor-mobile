import React, { Component } from 'react';
import {
  ScrollView,
  AsyncStorage
} from 'react-native';
import MenteeList from '../components/menteeList/MenteeList';

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
    console.log('HM Token:');
    console.log(token);

    this.setState({
      hmToken: token
    });

    // this.getUserData(this.state.fbUserId, this.state.fbToken);
    if (this.state.hmToken) {
      const profile = await this.getMyProfile(JSON.parse(this.state.hmToken));
      this.constructContactItemsFromResponse(profile.contacts, JSON.parse(this.state.hmToken));
    } else {
      console.log("Error, we don't have a HeyMentor token");
    }
  }

  getMyProfile = async (token) => {
    const API_URL = 'http://10.91.28.70:8081';

    console.log('Getting profile info');
    console.log(token);
    console.log(token._id);
    console.log(token.api_key);

    console.log(`${API_URL}/profile/${token._id}?token=${token.api_key}`);

    const response = await fetch(
      `${API_URL}/profile/${token._id}?token=${token.api_key}`
    );

    const responseJson = await response.json();

    console.log('Printing getMyProfile results');
    console.log(responseJson);

    // bugsnag.notify(new Error('Test'));

    return responseJson;
  };

  constructContactItemsFromResponse = async (contactIds, token) => {
    console.log('Getting contacts');
    console.log(contactIds);

    const API_URL = 'http://10.91.28.70:8081';

    const contactItems = [];
    const requestString = `${API_URL}/contacts/${token._id}?token=${token.api_key}`;
    console.log(requestString);
    const contactData = fetch(requestString)
      .then(response => response.json())
      .catch(error => console.log(`Error parsing JSON: ${error}`))
      // TODO: Show "No mentees" error message on screen
      .then(responseJson => responseJson.contacts.map((contact) => {
        console.log('Working with a contact: ');
        console.log(contact);

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
        console.error(error);
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
