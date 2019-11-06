import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';

class BubbleRect extends Component {
  render() {
    return (
      <Text style={[styles.bubbleRect, this.props.highlight && styles.highlight, this.props.style]}>
        {this.props.name}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  bubbleRect: {
    padding: 7,
    color: '#bdbdbd',
    fontSize: 14,
    alignSelf: 'flex-start'
  },
  highlight: {
    color: '#f2f2f2',
    backgroundColor: '#007aff',
    borderRadius: 5
  }
});

export default BubbleRect;
