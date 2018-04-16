import React, { Component } from 'react';
import './BubbleList.css';
import BubbleRect from './BubbleRect.js';

class BubbleList extends Component {
	render() {

        const items = [];
        this.props.items.forEach(item => {
            items.push(
                <div className="bubbleContainer">
                    <BubbleRect name={item.name} highlight={item.highlight} />
                </div>
            )
        })

		return (
            <div className="bubbleList">
                { items }
            </div>
        )
	}
}

export default BubbleList;
