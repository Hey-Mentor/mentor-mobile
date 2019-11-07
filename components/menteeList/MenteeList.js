import React, { Component } from 'react';
import { View } from 'react-native';
import MenteeListItem from './MenteeListItem';

class MenteeList extends Component {
  renderSections() {
    return this.props.menteeItem.map(item => (
      <MenteeListItem navigation={this.props.navigation} key={item.id} item={item} />
    ));
  }

  render() {
    return <View>{this.renderSections()}</View>;
  }
}

export default MenteeList;
