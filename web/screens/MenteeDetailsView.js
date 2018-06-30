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
    headerTitleStyle,
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          //navigation.navigate('menteeListView');
          navigation.goBack();
        }}
      >
        <Icon name="arrow-left" type="font-awesome" size={25} iconStyle={styles.leftImage} />
      </TouchableOpacity>
    ),

    headerRight: <Icon name="gear" type="font-awesome" size={40} iconStyle={styles.rightImage} />
  });

  render() {
    const { state, navigate } = this.props.navigation;
    return <MenteeDetails mentee={state.params.mentee} />;
  }
}

export default MenteeDetailsView;
