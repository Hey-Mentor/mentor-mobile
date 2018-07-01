import React, { Component } from 'react';
import './BubbleRect.css';

class BubbleRect extends Component {
	render() {

		// Render supported state
		let innerClassName = "bubbleRect";
		if (this.props.highlight) {
			innerClassName += " highlight";
		}

		// Return component
		return (
            <div className={innerClassName}>
                {this.props.name}
            </div>
		);
	}
}

export default BubbleRect;
