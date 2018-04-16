import React, { Component } from 'react';
import './DetailsHeader.css';

class DetailsHeader extends Component {
	render() {
		return (
            <div id="detailsHeader">
                <div id="headerPicture">
                    <img alt="Profile picture" src={this.props.image}/>
                </div>
                <div id="headerInfo">
                    <div id="messageBtn">Message</div>
                    <div><span id="messageDelay">{this.props.delay}</span> since last message</div>
                </div>
            </div>
        )
	}
}

export default DetailsHeader;
