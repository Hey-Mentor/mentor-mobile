import React from 'react';
import { Text, StyleSheet } from 'react-native';

const BubbleRect = ({
  name, highlight, style
}) => (
  <Text style={[styles.bubbleRect, highlight && styles.highlight, style]}>
    {name}
  </Text>
);

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
