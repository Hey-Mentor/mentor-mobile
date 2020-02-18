import React from 'react';
import {
  View, Text, StyleSheet
} from 'react-native';
import { Avatar } from 'react-native-elements';

const DetailsHeader = ({
  mentee, image, delay
}) => (
  <View id="detailsHeader" style={styles.detailsHeader}>
    <View id="headerPicture" style={[styles.headerSection]}>
      <Avatar rounded size="xlarge" source={image} />
    </View>
    <View id="headerInfo" style={[styles.headerSection]}>
      <Text style={[styles.headerText]}>{mentee.person.fname}</Text>
      <Text style={[styles.messageText, styles.messageColumn]}>
        <Text style={styles.messageDelay}>{delay}</Text>
        {' '}
        since last message
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  detailsHeader: {
    flexDirection: 'row',
    padding: 16
  },
  headerSection: {
    flex: 1
  },
  headerText: {
    textAlign: 'center',
    flex: 2,
    flexWrap: 'wrap',
    fontSize: 30
  },
  messageText: {
    textAlign: 'center',
    flex: 1,
    flexWrap: 'wrap'
  },
  messageDelay: {
    fontWeight: 'bold'
  },
  messageBtn: {
    fontSize: 18,
    marginTop: 24,
    marginBottom: 24,
    padding: 15,
    textAlign: 'center'
  },
  messageColumn: {
    width: 118,
    alignSelf: 'center'
  }
});

export default DetailsHeader;
