import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import MenteeList from '../components/menteeList/MenteeList';
import BadgeIcon from '../components/common/BadgeIcon';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  AsyncStorage
} from 'react-native';

class MenteeListView extends Component {
  state = {
    menteeItem: [],
    fbToken: '',
    fbUserId: '',
    hmToken: {},
    backendBase: "http://10.91.28.70:3002"
  };

  //this.backendBase = "https://heymentortestdeployment.herokuapp.com";

  async componentDidMount() {
    const token = await AsyncStorage.getItem('fb_token');
    const id = await AsyncStorage.getItem('fb_id');

    this.setState({
      fbToken: token,
      fbUserId: id
    });

    //this.getUserData(this.state.fbUserId, this.state.fbToken);
    this.getHeyMentorToken(this.state.fbToken, "facebook");
  }

  constructMenteeItemsFromResponse = async (menteeIds, token) => {
    menteeItems = [];

    for (let mentee of menteeIds) {
      let response = await fetch(
        `${this.state.backendBase}/mentees/${mentee}/${token}`
      );
      let responseJson = await response.json();

      console.log(responseJson);

      fullName =
        responseJson[0].person.fname + ' ' + responseJson[0].person.lname;
      menteeItems.push({
        name: fullName,
        school: responseJson[0].school.name,
        grade: responseJson[0].school.grade,
        id: responseJson[0].mentee_id,
        fullMentee: responseJson[0]
      });
    }

    this.setState({ menteeItem: menteeItems });

    console.log('mentee items');
    console.log(menteeItems);
  };

  getHeyMentorToken = async (token, authType) => {

    console.log("Making GetToken request");
    console.log(`${this.state.backendBase}/token/${token}/${authType}`);

    let response = await fetch(
      `${this.state.backendBase}/token/${token}/${authType}`
    );
    let responseJson = await response.json();

    console.log('Printing responsejson from GetToken');
    console.log(responseJson);
    console.log("done printing");

    if(responseJson && !responseJson.error){
      this.setState({ hmToken: responseJson });  
    }else{
      console.log("Error authenticating with fed token");
    }   
  };


  getUserData = async (userId, token) => {
    console.log('FacebookID: ' + userId);

    let response = await fetch(
      `${this.state.backendBase}/mentors/${userId}/${token}`
    );
    let responseJson = await response.json();

    console.log('Printing responsejson');
    console.log(responseJson);

    console.log('Mentees:');
    console.log(responseJson[0].mentee_ids);
    this.constructMenteeItemsFromResponse(responseJson[0].mentee_ids, token);
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
          menteeItem={this.state.menteeItem}
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
