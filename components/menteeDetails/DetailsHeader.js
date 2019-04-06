import React, { Component } from 'react';
import {
  View, Text, Image, StyleSheet
} from 'react-native';
import BubbleRect from './BubbleRect.js';

class DetailsHeader extends Component {
  render() {
    const mentee = this.props.mentee;

    const styles = StyleSheet.create({
      detailsHeader: {
        flexDirection: 'row',
        padding: 16
      },
      imageSection: {
        flex: 1,
        textAlign: 'left'
      },
      headerSection: {
        flex: 2,
        textAlign: 'left'
      },
      headerText: {
        flex: 2,
        flexWrap: 'wrap',
        fontSize: 24
      },
      messageText: {
        flex: 1,
        flexWrap: 'wrap'
      },
      messageDelay: {
        fontWeight: 'bold'
      },
      headerImage: {
        borderRadius: 50,
        width: 100,
        height: 100
      },
      messageColumn: {
        width: 118,
        alignSelf: 'center'
      }
    });

    return (
      <View id="detailsHeader" style={styles.detailsHeader}>
        <View id="headerPicture" style={[styles.imageSection]}>
          <Image style={styles.headerImage} source={{ uri: this.props.image }} />
        </View>
        <View id="headerInfo" style={[styles.headerSection]}>
          <Text style={[styles.headerText]}>{mentee.person.fname} {mentee.person.lname}</Text>

          <Text>{mentee.school.name}</Text>
          <Text>{mentee.school.grade} year</Text>

          <Text style={[styles.messageText]}>
                      <Text style={styles.messageDelay}>{this.props.delay}</Text>
                      {' '}
          since last message
                    </Text>
        </View>
      </View>
    );
  }
}

export default DetailsHeader;
