import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class BadgeIcon extends Component {
  render() {
    return (
      <View>
        {this.props.children}
        {this.props.count ? (
          <View style={styles.IconBadge}>
            <Text style={{ color: 'white' }}>
              {Math.min(this.props.count, 99)}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  IconBadge: {
    position: 'absolute',
    top: -5,
    left: 35,
    width: 22,
    height: 22,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000'
  }
});

export default BadgeIcon;
