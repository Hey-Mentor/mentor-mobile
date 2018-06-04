import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import MenteeList from '../components/menteeList/MenteeList';
import { ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';

class MenteeListView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Mentees',
    headerTitleStyle,
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('notifications');
        }}
      >
        <Icon name="ios-notifications" type="ionicon" size={40} iconStyle={styles.leftImage} />
      </TouchableOpacity>
    ),

    headerRight: <Icon name="gear" type="font-awesome" size={40} iconStyle={styles.rightImage} />
  });

  state = {
    menteeItem: [
      {
        name: 'Kevin Troung',
        school: 'Garfield Senior High School',
        grade: 'Grade Level 12'
      },
      {
        name: 'Chadwick Boseman',
        school: 'Wakanda High School',
        grade: 'Grade Level 12'
      },
      {
        name: 'Arthur Gonzales',
        school: 'Burbank High School',
        grade: 'Grade Level 12'
      }
    ]
  };

  render() {
    return (
      <ScrollView>
        <MenteeList menteeItem={this.state.menteeItem} navigation={this.props.navigation} />
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
