import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import BubbleRect from './BubbleRect.js';

class BubbleList extends Component {
  render() {
    const styles = StyleSheet.create({
      bubbleContainer: {
        width: 150
      },
      bubbleList: {
        flexDirection: 'row',
        flexWrap: 'wrap'
      }
    });

    const items = [];
    this.props.items.forEach((item, idx) => {
      items.push(
        <View key={idx} style={styles.bubbleContainer}>
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

export default BubbleList;
