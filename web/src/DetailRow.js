import React, { Component } from 'react';
import './MenteeDetails.css';

class DetailRow extends Component {
	render() {
		// Accept additional classes through the 'className' property
		let componentClass = "detailRow";
		if (this.props.className) {
			componentClass += ` ${this.props.className}`;
		}

		// Return the component
		return (<div className={componentClass}>
                    <div className="detailKey">{this.props.name}</div>
                    <div className="detailValue">{this.props.value}</div>
                </div>);
	}
}

export default DetailRow;
