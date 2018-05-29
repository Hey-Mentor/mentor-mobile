import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'

class BubbleRect extends Component {
  render() {
    const styles = StyleSheet.create({
      bubbleRect: {
        padding: 7,
        color: "#bdbdbd",
        fontSize: 14,
        alignSelf: 'flex-start'
      },
      highlight: {
        color: "#f2f2f2",
        backgroundColor: "#19afe5",
        borderRadius: 5
      }
    });

    return (
      <Text style={[styles.bubbleRect, this.props.highlight && styles.highlight, this.props.style]}>
        {this.props.name}
      </Text>
    );
  }
}

export default BubbleRect;
