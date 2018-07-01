import React, { Component } from 'react';
import './Navbar.css';

class Navbar extends Component {
	render() {
		return (
            <div id="navbar">
                <div id="navbarLine">
                    <img src={this.props.leftImage} className="leftImage" />
                    <div id="navbarName">{ this.props.menteeName }</div>
                    <img src={this.props.rightImage} className="rightImage" />
                </div>
                <hr />
            </div>
        )
	}
}

export default Navbar;
