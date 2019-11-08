import React from 'react';
import { View } from 'react-native';
import MenteeListItem from './MenteeListItem';


const MenteeList = ({
  menteeItem,
  navigation
}) => (
  <View>
    {menteeItem.map(item => (
      <MenteeListItem navigation={navigation} key={item.id} item={item} />
    ))}
  </View>
);

export default MenteeList;
