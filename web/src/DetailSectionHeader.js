import React, { Component } from 'react';
import './MenteeDetails.css';

class DetailSectionHeader extends Component {
	render() {
		return (
			<div className="sectionHeader">
                <div className="headerTitle">{this.props.title}</div>
                <hr />
            </div>
		);
	}
}

export default DetailSectionHeader;
