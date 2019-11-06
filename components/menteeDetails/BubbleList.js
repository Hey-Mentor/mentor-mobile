import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import BubbleRect from './BubbleRect.js';

class BubbleList extends Component {
  render() {
    const items = [];
    this.props.items.forEach((item) => {
      items.push(
        <View key={item.name} style={styles.bubbleContainer}>
          <BubbleRect name={item.name} highlight={item.highlight} />
        </View>
      );
    });

    return (
      <View style={styles.bubbleList}>
        { items }
      </View>
    );
  }
}

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
