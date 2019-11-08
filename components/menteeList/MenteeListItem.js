import React from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity
} from 'react-native';
import CONFIG from '../../config.js';

const MenteeListItem = ({
  navigation, item
}) => (
  <TouchableOpacity onPress={() => navigation.navigate('chat', { mentee: item.fullContact })}>
    <View style={styles.containerStyle}>
      <Image style={styles.headerImage} source={{ uri: `${CONFIG.FACEBOOK_PROFILE_LINK.PREFIX}${item.facebook_id}${CONFIG.FACEBOOK_PROFILE_LINK.SUFFIX}` }} />
      <View style={styles.textHeader}>
        <Text style={styles.textTitle}>
          {item.name}
          {' '}
        </Text>
        <Text style={styles.textDetail}>{item.school}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

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
