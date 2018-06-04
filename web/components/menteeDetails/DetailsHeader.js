import React, { Component } from 'react';
import BubbleRect from './BubbleRect.js';
import { View, Text, Image, StyleSheet } from 'react-native';

class DetailsHeader extends Component {
  render() {
    const styles = StyleSheet.create({
      detailsHeader: {
        flexDirection: 'row',
        padding: 16
      },
      headerSection: {
        flex: 1
      },
      messageText: {
        textAlign: 'center',
        flex: 1,
        flexWrap: 'wrap'
      },
      messageDelay: {
        fontWeight: 'bold'
      },
      headerImage: {
        borderRadius: 75,
        width: 150,
        height: 150
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

    return (
      <View id="detailsHeader" style={styles.detailsHeader}>
        <View id="headerPicture" style={[styles.headerSection]}>
          <Image style={styles.headerImage} source={{ uri: this.props.image }} />
        </View>
        <View id="headerInfo" style={[styles.headerSection]}>
          <BubbleRect name="Message" highlight style={[styles.messageBtn, styles.messageColumn]} />
          <Text style={[styles.messageText, styles.messageColumn]}>
            <Text style={styles.messageDelay}>{this.props.delay}</Text> since last message
          </Text>
        </View>
      </View>
    );
  }
}

export default DetailsHeader;
