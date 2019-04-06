import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class DetailSectionHeader extends Component {
  render() {
    const styles = StyleSheet.create({
      container: {
        flexDirection: 'row'
      },
      sectionHeader: {
        color: '#8A8A8F',
        fontSize: 16,
        paddingBottom: 8,
        paddingLeft: 16
      }
    });

    return (
      <View style={styles.container}>
        <Text style={styles.sectionHeader}>{this.props.title}</Text>
      </View>
    );
  }
}

export default DetailSectionHeader;
