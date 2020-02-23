import React from 'react';
import { View, SectionList } from 'react-native';
import LinkListItem from './LinkListItem.js';
import DetailSectionHeader from '../menteeDetails/DetailSectionHeader.js';

const LinkList = ({ linkItems }) => {
  if (linkItems) {
    return (
      <View>
        <SectionList
          sections={linkItems}
          renderItem={({ item }) => <LinkListItem url={item.url} />}
          keyExtractor={item => item.dateSent}
          renderSectionHeader={({ section: { title } }) => (
            <DetailSectionHeader title={title} />
          )}
        />
      </View>
    );
  }
  // If there are no link items
  return <View />;
};

export default LinkList;
