import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import MenteeDetails from '../components/menteeDetails/MenteeDetails';

const headerTitleStyle = {
  flex: 1,
  textAlign: 'center',
  color: '#000000',
  fontSize: 24,
  fontWeight: 'bold'
};

const styles = StyleSheet.create({
  leftImage: {
    marginLeft: 15,
    marginBottom: 10
  },
  rightImage: {
    marginRight: 24,
    marginBottom: 10
  }
});

class MenteeDetailsView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Ace N',
    headerTitleStyle,
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('menteeListView');
        }}
      >
        <Icon name="arrow-left" type="font-awesome" size={25} iconStyle={styles.leftImage} />
      </TouchableOpacity>
    ),

    headerRight: <Icon name="gear" type="font-awesome" size={40} iconStyle={styles.rightImage} />
  });

  state = {
    mentee: {
      name: 'Ace N',
      gradDate: 'May 20th, 2012',
      year: 'Senior',
      highSchool: 'Barry Goldwater HS',
      ethnicity: 'Syrian/American',
      race: 'White',
      gender: 'Male',
      gpa: 3.95,
      satScore: 2200,
      colleges: {
        reach: [
          {
            name: 'University of Illinois',
            location: 'Urbana, IL'
          },
          {
            name: 'Georgia Tech',
            location: 'Atlanta, GA'
          }
        ],
        match: [
          {
            name: 'Arizona State University',
            location: 'Tempe, AZ'
          }
        ]
      },
      hobbies: 'Coding, Video Games',
      extracurriculars: 'NHS, SkillsUSA, spending way too much time coding'
    }
  };

  render() {
    return <MenteeDetails mentee={this.state.mentee} />;
  }
}

export default MenteeDetailsView;
