import React, { Component } from 'react';
import { View, Text } from 'react-native';
import MenteeListSection from './MenteeListSection';
import MenteeListItem from './MenteeListItem';

class MenteeList extends Component {
  renderSections() {
    return this.props.menteeItem.map(item => (
      <MenteeListItem navigation={this.props.navigation} key={item.name} item={item} />
    ));
  }
  render() {
    return <View>{this.renderSections()}</View>;
  }
}

export default MenteeList;
