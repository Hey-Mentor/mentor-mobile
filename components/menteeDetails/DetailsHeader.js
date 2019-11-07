import React, { Component } from 'react';
import {
  View, Text, Image, StyleSheet
} from 'react-native';

class DetailsHeader extends Component {
  render() {
    const { mentee } = this.props;
    return (
      <View id="detailsHeader" style={styles.detailsHeader}>
        <View id="headerPicture" style={[styles.headerSection]}>
          <Image style={styles.headerImage} source={this.props.image} />
        </View>
        <View id="headerInfo" style={[styles.headerSection]}>
          <Text style={[styles.headerText]}>{mentee.person.fname}</Text>
          <Text style={[styles.messageText, styles.messageColumn]}>
            <Text style={styles.messageDelay}>{this.props.delay}</Text>
            {' '}
since last message
          </Text>
        </View>
      </View>
    );
  }
}

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

export default DetailsHeader;
