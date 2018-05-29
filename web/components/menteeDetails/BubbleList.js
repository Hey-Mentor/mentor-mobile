import React, { Component } from 'react';
import BubbleRect from './BubbleRect.js';
import { View, Text, StyleSheet } from 'react-native'

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
      )
    })

    return (
      <View style={styles.bubbleList}>
        { items }
      </View>
    )
  }
}

export default BubbleList;
