import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class DetailRow extends Component {
  render() {
    return (
      <View style={styles.detailRow}>
        <Text style={[styles.detailKey, styles.detailText, { width: this.props.wide ? 110 : 84 }]}>{this.props.name}</Text>
        <Text style={[styles.detailText]}>{this.props.value}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: 'row',
    paddingBottom: 7,
    marginLeft: 16
  },
  detailKey: {
    paddingRight: 7,
    fontWeight: 'bold',
  },
  detailText: {
    color: '#4f4f4f',
    fontSize: 14,
    flex: 1,
    flexWrap: 'wrap'
  }
});

export default DetailRow;
