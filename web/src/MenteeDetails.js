import React, { Component } from 'react';
import details from './MenteeDetails.css';

class MenteeDetails extends Component {
    render() {
        const mentee = this.props.mentee;

        const propertyNames = {
            "highSchool": "High School",
            "gradDate": "Graduation Date",
            "schoolYear": "School Year",
            "ethnicity": "Ethnicity",
            "race": "Race",
            "gender": "Gender"
        }

        const propertyRows = Object.keys(propertyNames).map((k) => 
            <div className="detailRow">
                <div className="detailKey">{propertyNames[k]}</div>
                <div className="detailValue">{mentee[k]}</div>
            </div>
        )

        return (
            <div id="details" className="menteeDetails">
                <div id="detailsHeader">
                    <img alt="" src="https://www.w3schools.com/howto/img_avatar.png" className="profilePic" />
                    <div className="menteeName headText">
                        <h1>{mentee.name}</h1>
                    </div>
                </div>

                {propertyRows}
            </div>
        );
    }
}

export default MenteeDetails;
