import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetailRow = ({
  name, wide, value
}) => (
  <View style={styles.detailRow}>
    <Text style={[styles.detailKey, styles.detailText, { width: wide ? 110 : 84 }]}>{name}</Text>
    <Text style={[styles.detailText]}>{value}</Text>
  </View>
);

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
