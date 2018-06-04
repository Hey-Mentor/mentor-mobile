import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { Button } from '../common/Button';

class MenteeListSection extends Component {
  render() {
    const mentee = this.props.item;

    return (
      <ScrollView style={styles.containerStyle}>
        <View style={styles.header}>
          <Image style={styles.headerImage} source={require('../../assets/img_avatar.png')} />
          <View style={styles.textHeader}>
            <Text style={styles.textTitle}>{mentee.name} </Text>
            <Text style={styles.textDetail}>{mentee.school}</Text>
            <Text style={styles.textDetail}>{mentee.grade}</Text>
          </View>
        </View>

        <View style={styles.buttonStyle}>
          <Button onPress={() => this.props.navigation.navigate('menteeDetails')}>
            View Profile
          </Button>
          <Button onPress={() => this.props.navigation.navigate('menteeDetails')}>Message</Button>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(25, 175, 229, 0.33)',
    margin: 10,
    padding: 10,
    borderRadius: 5
  },
  headerStyle: {
    backgroundColor: 'blue'
  },
  header: {
    flexDirection: 'row'
  },
  headerImage: {
    borderRadius: 50,
    width: 100,
    height: 100,
    margin: 10,
    marginRight: 20
  },
  textHeader: {
    flexDirection: 'column',
    alignSelf: 'center'
  },
  textTitle: {
    fontSize: 24,
    marginBottom: 10
  },
  textDetail: {
    fontSize: 14,
    flexWrap: 'wrap'
  },
  buttonStyle: {
    flexDirection: 'row',
    marginLeft: 15,
    justifyContent: 'space-around'
  }
});

export default MenteeListSection;
