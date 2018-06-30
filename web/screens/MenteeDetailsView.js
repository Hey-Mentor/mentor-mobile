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
    //title: {state.params.mentee.fname},  
    headerTitleStyle
  });

  render() {
    const { state, navigate } = this.props.navigation;
    return <MenteeDetails mentee={state.params.mentee} />;
  }
}

export default MenteeDetailsView;