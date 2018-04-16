import React, { Component } from 'react';
import './MenteeDetails.css';
import DetailsHeader from './DetailsHeader.js'
import DetailRow from './DetailRow.js'
import DetailSectionHeader from './DetailSectionHeader.js'
import BubbleList from './BubbleList.js'
import CollegeList from './CollegeList.js'
import Navbar from './Navbar.js'

class MenteeDetails extends Component {
    render() {
        const mentee = this.props.mentee;

        const supportAreas = [
            { name: "College applications", highlight: false },
            { name: "Scholarships", highlight: false },
            { name: "Financial aid", highlight: false },
            { name: "College search", highlight: false },
            { name: "Career advice", highlight: true },
            { name: "Exam preparation", highlight: false }
        ];

        return (
            <div id="details" className="menteeDetails">
                <Navbar menteeName={mentee.name} />

                <DetailsHeader image="https://www.w3schools.com/howto/img_avatar.png" delay="0 days" />

                <div id="detailSectionList">
                    <DetailSectionHeader title="Demographics" />
                    <DetailRow name="Gender" value={mentee.gender} />
                    <DetailRow name="Race" value={mentee.race} />
                    <DetailRow name="Ethnicity" value={mentee.ethnicity} />

                    <DetailSectionHeader title="School" />
                    <DetailRow name="High School" value={mentee.highSchool} />
                    <DetailRow name="Year" value={mentee.year} />
                    <DetailRow name="Expected Grad Date" value={mentee.gradDate} />
                    <DetailRow name="GPA" value={mentee.gpa} />
                    <DetailRow name="SAT" value={mentee.satScore} />

                    <DetailSectionHeader title="Colleges" />
                    <CollegeList collegeClass="Reach" colleges={mentee.colleges.reach} />
                    <CollegeList collegeClass="Match" colleges={mentee.colleges.match} />

                    <DetailSectionHeader title="Areas of support" />
                    <BubbleList items={supportAreas} />

                    <DetailSectionHeader title="Bio" />
                    <DetailRow className="detailRowWideKey" name="Hobbies" value={mentee.hobbies} />
                    <DetailRow className="detailRowWideKey" name="Extracurricular Activities" value={mentee.extracurriculars} />
                </div>
            </div>
        );
    }
}

export default MenteeDetails;
