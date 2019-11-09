import React from 'react';
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import CONFIG from '../../config.js';

const MenteeList = ({
  menteeItem,
  navigation
}) => (
    <View>
      {menteeItem.map(item => (
        <ListItem
          title={item.name}
          subtitle={item.school}
          leftAvatar={{ source: { uri: `${CONFIG.FACEBOOK_PROFILE_LINK.PREFIX}${item.facebook_id}${CONFIG.FACEBOOK_PROFILE_LINK.SUFFIX}` } }}
          bottomDivider
          onPress={() => navigation.navigate('chat', { mentee: item.fullContact })}
          key={item.id}
        />
      ))}
    </View>
  );

export default MenteeList;
