import React, { Component } from 'react';
import './MenteeDetails.css';

class SupportArea extends Component {
	render() {

		// Render supported state
		let innerClassName = "supportArea";
		if (this.props.supported) {
			innerClassName += " supported";
		}

		// Return component
		return (
			<div className="supportAreaContainer">
                <div className={innerClassName}>
                    {this.props.area}
                </div>
            </div>
		);
	}
}

export default SupportArea;
