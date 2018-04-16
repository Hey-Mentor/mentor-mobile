import React, { Component } from 'react';
import './Navbar.css';

class Navbar extends Component {
	render() {
		return (
            // TODO(ace-n) replace placeholder font-awesome icons with actual images
            <div id="navbar">
                <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
                <div id="navbarLine">
                    <i className="fa fa-arrow-left"></i>
                    <div id="navbarName">{ this.props.menteeName }</div>
                    <i className="fa fa-cog"></i>
                </div>
                <hr />
            </div>
        )
	}
}

export default Navbar;
