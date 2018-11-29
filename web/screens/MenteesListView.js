import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import MenteeList from '../components/menteeList/MenteeList';
import BadgeIcon from '../components/common/BadgeIcon';
import base64 from 'react-native-base64';
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
    hmToken: '',
    backendBase: "http://10.91.28.70:3002"
  };

  //this.backendBase = "https://heymentortestdeployment.herokuapp.com";

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
      var profile = await this.getMyProfile(this.state.hmEncoded);
      this.constructContactItemsFromResponse(profile[0].contacts, encoded);
    }else{
      console.log("Error, we don't have a HeyMentor token");
    }
  }

  getMyProfile = async (token) => {
    console.log("Getting profile info");

    let response = await fetch(
      `${this.state.backendBase}/me/${token}`
    );
    
    let responseJson = await response.json();

    console.log("Printing getMyProfile results");
    console.log(responseJson);

    return responseJson;
  };

  constructContactItemsFromResponse = async (contactIds, token) => {
    console.log("Getting contacts");

    contactItems = [];

    for (let contact of contactIds) {

      console.log("Contact ID");
      console.log(contact);

      let response = await fetch(
        `${this.state.backendBase}/profile/${contact}/${token}`
      );
      let responseJson = await response.json();

      console.log(responseJson);

      fullName = responseJson[0].person.fname + ' ' + responseJson[0].person.lname;
      contactItems.push({
        name: fullName,
        school: responseJson[0].school.name,
        grade: responseJson[0].school.grade,
        id: responseJson[0].mentee_id,
        fullContact: responseJson[0]
      });
    }

    this.setState({ contactItem: contactItems });

    console.log('contact items');
    console.log(contactItems);
  };

  static navigationOptions = ({ navigation }) => ({
    title: 'Mentees',
    headerTitleStyle,
    headerLeft: (
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

    )
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
