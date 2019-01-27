import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class DetailSectionHeader extends Component {
  render() {
    const styles = StyleSheet.create({
      container: {
        flexDirection: 'row'
      },
      sectionHeader: {
        color: '#19AFE5',
        // fontFamily: 'Roboto',
        fontSize: 18,
        paddingBottom: 5
      },
      hr: {
        borderBottomWidth: 1,
        borderBottomColor: '#bdbdbd',
        marginLeft: 15,
        height: 14,
        flex: 1
      }
    });

    return (
      <View style={styles.container}>
        <Text style={styles.sectionHeader}>{this.props.title}</Text>
        <View style={styles.hr} />
      </View>
    );
  }
}

export default DetailSectionHeader;
