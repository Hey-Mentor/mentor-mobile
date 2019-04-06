import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class DetailRow extends Component {
  render() {
    const styles = StyleSheet.create({
      detailRow: {
        paddingBottom: 24,
        paddingTop: 24,
        paddingRight: 16,
        borderBottomWidth: this.props.last ? 0 : 1,
        borderBottomColor: '#E5E5E5',
        borderStyle: 'solid'
      },
      detailKey: {
        color: '#8A8A8F',
        fontSize: 16,
        paddingBottom: 8,
        width: this.props.wide ? 110 : 84
      },
      detailText: {
        color: '#222222',
        fontSize: 16,
        lineHeight: 24
      }
    });

    return (
      <View style={styles.detailRow}>
        <Text style={[styles.detailKey]}>{this.props.name}</Text>
        <Text style={[styles.detailText]}>{this.props.value}</Text>
      </View>
    );
  }
}

export default DetailRow;
