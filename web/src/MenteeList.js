import React, { Component } from 'react';
import MenteeCard from './MenteeCard';

class MenteeList extends Component {
  render() {
    const menteeCards = [];

    this.props.mentees.forEach((mentee) => {
      menteeCards.push(
        <MenteeCard mentee={mentee} key={mentee.id}/>
      );
    });
    return (
      <div>
        {menteeCards}
      </div>
    );
  }
}

export default MenteeList;
