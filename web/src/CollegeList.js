import React, { Component } from 'react';
import './MenteeDetails.css';

class CollegeList extends Component {
	render() {

		// Construct college list
		const colleges = [];
        this.props.colleges.forEach(college => {
            colleges.push(
                <div>
                    { college.name }<br />
                    { college.location }
                </div>
            );
        });

        // Wrap college list (or return null, if no colleges are specified)
		if (this.props.colleges.length > 0) {
			return (
				<div className="collegeSection">
                    <div className="collegeClass">{this.props.collegeClass}</div>
                    { colleges }
                </div>
            );
		} else {
			return null;
		}
	}
}

export default CollegeList;
