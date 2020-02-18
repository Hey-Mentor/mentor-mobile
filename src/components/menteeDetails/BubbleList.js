import React from 'react';
import { View, StyleSheet } from 'react-native';
import BubbleRect from './BubbleRect.js';

const BubbleList = ({
  items
}) => (
  <View style={styles.bubbleList}>
    { items.map(item => (
      <View key={item.uniqueId} style={styles.bubbleContainer}>
        <BubbleRect name={item.name} highlight={item.highlight} />
      </View>
    )) }
  </View>
);

const styles = StyleSheet.create({
  bubbleContainer: {
    width: 150
  },
  bubbleList: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});

export default BubbleList;
