import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import MenteeList from '../components/menteeList/MenteeList';
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
    googleToken: '',
    googleUserId: ''
  };

  async componentDidMount() {
    const fbToken = await AsyncStorage.getItem('fb_token');
    const fbId = await AsyncStorage.getItem('fb_id');
    const gToken = await AsyncStorage.getItem('g_token');
    const gId = await AsyncStorage.getItem('g_id');

    this.setState({
      fbToken: fbToken,
      fbUserId: fbId,
      googleToken: gToken,
      googleUserId: gId
    });

    if (fbToken !== null) {
      this.getUserData(this.state.fbUserId);
    }
    if (gToken !== null) {
      this.getUserData(this.state.googleUserId);
    }
  }

  constructMenteeItemsFromResponse = async menteeIds => {
    menteeItems = [];

    for (let mentee of menteeIds) {
      let response = await fetch(
        `https://heymentortestdeployment.herokuapp.com/mentees/${mentee}`
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

  getUserData = async userId => {
    console.log('AuthID: ' + userId);

    let response = await fetch(
      `https://heymentortestdeployment.herokuapp.com/mentors/${userId}`
    );
    let responseJson = await response.json();

    console.log('Printing responsejson');
    console.log(responseJson);

    console.log('Mentees:');
    console.log(responseJson[0].mentee_ids);
    this.constructMenteeItemsFromResponse(responseJson[0].mentee_ids);
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
        <Icon
          name="ios-notifications"
          type="ionicon"
          size={40}
          iconStyle={styles.leftImage}
        />
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
