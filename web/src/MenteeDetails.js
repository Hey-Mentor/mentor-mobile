import React, { Component } from 'react';
import details from './MenteeDetails.css';

class MenteeDetails extends Component {
    render() {
        const mentee = this.props.mentee;

        const reachColleges = [];
        mentee.colleges.reach.forEach(college => {
            reachColleges.push(
                <div>
                    { college.name }<br />
                    { college.location }
                </div>
            );
        });

        const matchColleges = [];
        mentee.colleges.match.forEach(college => {
            matchColleges.push(
                <div>
                    { college.name }<br />
                    { college.location }
                </div>
            );
        });

        // TODO(ace-n) replace placeholder font-awesome icons with actual images
        return (
            <div id="details" className="menteeDetails">
                <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />

                <div id="navbar">
                    <div id="navbarLine">
                        <i className="fa fa-arrow-left"></i>
                        <div id="navbarName">{ mentee.name }</div>
                        <i className="fa fa-cog"></i>
                    </div>
                    <hr />
                </div>

                <div id="detailsHeader">
                    <div id="headerPicture">
                        <img alt="" src="https://www.w3schools.com/howto/img_avatar.png"/>
                    </div>
                    <div id="headerInfo">
                        <div id="messageBtn">Message</div>
                        <div><span id="messageDelay">0 days</span> since last message</div>
                    </div>
                </div>

                <div id="detailSectionList">
                    <div className="sectionHeader">
                        <div className="headerTitle">Demographics</div>
                        <hr />
                    </div>
                    <div className="detailRow">
                        <div className="detailKey">Gender</div>
                        <div className="detailValue">{mentee.gender}</div>
                    </div>
                    <div className="detailRow">
                        <div className="detailKey">Race</div>
                        <div className="detailValue">{mentee.race}</div>
                    </div>
                    <div className="detailRow">
                        <div className="detailKey">Ethnicity</div>
                        <div className="detailValue">{mentee.ethnicity}</div>
                    </div>

                    <div className="sectionHeader">
                        <div className="headerTitle">School</div>
                        <hr />
                    </div>
                    <div className="detailRow">
                        <div className="detailKey">High School</div>
                        <div className="detailValue">{mentee.highSchool}</div>
                    </div>
                    <div className="detailRow">
                        <div className="detailKey">Year</div>
                        <div className="detailValue">{mentee.year}</div>
                    </div>
                    <div className="detailRow">
                        <div className="detailKey">Expected Grad Date</div>
                        <div className="detailValue">{mentee.gradDate}</div>
                    </div>
                    <div className="detailRow">
                        <div className="detailKey">GPA</div>
                        <div className="detailValue">{mentee.gpa}</div>
                    </div>
                    <div className="detailRow">
                        <div className="detailKey">SAT</div>
                        <div className="detailValue">{mentee.satScore}</div>
                    </div>

                    <div className="sectionHeader">
                        <div className="headerTitle">Colleges</div>
                        <hr />
                    </div>
                    { reachColleges.length > 0 ?
                        <div className="collegeSection">
                            <div className="collegeClass">Reach</div>
                            { reachColleges }
                        </div> :
                        null
                    }
                    { matchColleges.length > 0 ?
                        <div className="collegeSection">
                            <div className="collegeClass">Match</div>
                            { matchColleges }
                        </div> :
                        null
                    }

                    <div className="sectionHeader">
                        <div className="headerTitle">Areas of support</div>
                        <hr />
                    </div>
                    <div className="supportAreaList">
                        <div className="supportAreaContainer">
                            <div className="supportArea">
                                College applications
                            </div>
                        </div>
                        <div className="supportAreaContainer">
                            <div className="supportArea supported">
                                Scholarships
                            </div>
                        </div>
                        <div className="supportAreaContainer">
                            <div className="supportArea">
                                Financial aid
                            </div>
                        </div>
                        <div className="supportAreaContainer">
                            <div className="supportArea">
                                College search
                            </div>
                        </div>
                        <div className="supportAreaContainer">
                            <div className="supportArea">
                                Career advice
                            </div>
                        </div>
                        <div className="supportAreaContainer">
                            <div className="supportArea">
                                Exam preparation
                            </div>
                        </div>
                    </div>

                    <div className="sectionHeader">
                        <div className="headerTitle">Bio</div>
                        <hr />
                    </div>
                    <div className="detailRow detailRowWideKey">
                        <div className="detailKey">Hobbies</div>
                        <div className="detailValue">{mentee.hobbies}</div>
                    </div>
                    <div className="detailRow detailRowWideKey">
                        <div className="detailKey">Extracurricular Activities</div>
                        <div className="detailValue">{mentee.extracurriculars}</div>
                    </div>

                </div>
            </div>
        );
    }
}

export default MenteeDetails;
