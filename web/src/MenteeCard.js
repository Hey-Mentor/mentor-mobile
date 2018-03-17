import React, { Component } from 'react';

class MenteeCard extends Component {
    render() {
        const menteeName = this.props.mentee.name;

        return (
        <div>
            {menteeName}
        </div>
        );
    }
}

export default MenteeCard;
