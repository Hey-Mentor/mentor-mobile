import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import MenteeList from '../components/menteeList/MenteeList';
import BadgeIcon from '../components/common/BadgeIcon';
import base64 from 'react-native-base64';
import Config from 'react-native-config';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  AsyncStorage
} from 'react-native';

class MenteeListView extends Component {
  state = {
    contactItem: [],
    hmToken: ''
  };

  async componentDidMount() {
    const token = await AsyncStorage.getItem('hm_token');
    console.log("HM Token:");
    console.log(token);

    let encoded = base64.encode(token);

    this.setState({
      hmToken: token,
      hmEncoded: encoded
    });

    //this.getUserData(this.state.fbUserId, this.state.fbToken);
    if(this.state.hmToken){
      var profile = await this.getMyProfile(JSON.parse(this.state.hmToken));
      this.constructContactItemsFromResponse(profile.contacts, JSON.parse(this.state.hmToken));
    }else{
      console.log("Error, we don't have a HeyMentor token");
    }
  }

  getMyProfile = async (token) => {
    const API_URL = "http://10.91.28.70:8081";
    const FACEBOOK_APP_ID = "1650628351692070";

    console.log("Getting profile info");
    console.log(token);
    console.log(token._id); 
    console.log(token.api_key);

    console.log(`${API_URL}/profile/${token._id}?token=${token.api_key}`);

    let response = await fetch(
      `${API_URL}/profile/${token._id}?token=${token.api_key}`
    );
    
    let responseJson = await response.json();

    console.log("Printing getMyProfile results");
    console.log(responseJson);

    return responseJson;
  };

  constructContactItemsFromResponse = async (contactIds, token) => {
    console.log("Getting contacts");
    console.log(contactIds);

    const API_URL = "http://10.91.28.70:8081";
    const FACEBOOK_APP_ID = "1650628351692070";

    contactItems = [];

    contactIds.map((contact) => {
      console.log("Contact ID");
      console.log(contact);

      var requestString = `${API_URL}/contacts/${contact}?token=${token.api_key}`;
      console.log(requestString);
      fetch(requestString)
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          //return responseJson.movies;
      })
      .catch((error) => {
        console.error(error);
      });
      //let responseJson = await response.json();

      
/*
      fullName = responseJson[0].person.fname + ' ' + responseJson[0].person.lname;
      contactItems.push({
        name: fullName,
        school: responseJson[0].school.name,
        grade: responseJson[0].school.grade,
        id: responseJson[0].mentee_id,
        fullContact: responseJson[0]
      });*/
    });

    this.setState({ contactItem: contactItems });
 
    console.log('contact items');
    console.log(contactItems);
  };

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.headerTitle}`,
    headerTitleStyle,
    headerLeft: null
    /*headerLeft: (
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

    )*/
  });

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

const styles = StyleSheet.create({
  leftImage: {
    marginLeft: 20,
    marginBottom: 5
  },
  rightImage: {
    marginRight: 10,
    marginBottom: 5
  }
});

export default MenteeListView;
