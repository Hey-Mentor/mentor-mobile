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
      headerImage: {
        borderRadius: 50,
        width: 100,
        height: 100
      },
      headerSection: {
        flex: 2,
        textAlign: 'left'
      },
      headerTitle: {
        fontSize: 24,
        paddingBottom: 8
      },
      headerText: {
        fontSize: 16
      },
      messageDelay: {
        fontWeight: 'bold'
      }
    });

    return (
      <View id="detailsHeader" style={styles.detailsHeader}>
        <View id="headerPicture" style={[styles.imageSection]}>
          <Image style={styles.headerImage} source={{ uri: this.props.image }} />
        </View>
        <View id="headerInfo" style={[styles.headerSection]}>
          <Text style={[styles.headerTitle]}>{mentee.person.fname} {mentee.person.lname}</Text>

          <Text style={[styles.headerText]}>{mentee.school.name}</Text>
          <Text style={[styles.headerText]}>{mentee.school.grade} year</Text>

          <Text style={[styles.headerText]}>
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
