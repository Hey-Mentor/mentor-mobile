import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity
} from 'react-native';

const avatarImage = require('../../assets/img_avatar.png');

class MenteeListItem extends Component {
  render() {
    const mentee = this.props.item;

    //Output the facebook ids of all loaded contacts
    //console.log('Facebook id: ' + this.props.item.fullContact.id);

    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('chat', { mentee: this.props.item.fullContact })}>
        <View style={styles.containerStyle}>
          <Image style={styles.headerImage} source={{ uri: 'https://graph.facebook.com/' + mentee.facebook_id + '/picture?type=large',  }} />
          <View style={styles.textHeader}>
            <Text style={styles.textTitle}>
              {mentee.name}
              {' '}
            </Text>
            <Text style={styles.textDetail}>{mentee.school}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  headerStyle: {
  },
  header: {
    flexDirection: 'row'
  },
  headerImage: {
    borderRadius: 35,
    width: 70,
    height: 70,
    margin: 10,
    marginRight: 20
  },
  textHeader: {
    flexDirection: 'column',
    alignSelf: 'center'
  },
  textTitle: {
    fontSize: 24,
    marginBottom: 5
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

export default MenteeListItem;
