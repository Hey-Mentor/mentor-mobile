import React, { Component } from 'react'
import MenteeDetails from '../components/menteeDetails/MenteeDetails'

class MenteeDetailsView extends Component {

  state = {
    mentee: {
      name: "Ace N",
      gradDate: "May 20th, 2012",
      year: "Senior",
      highSchool: "Barry Goldwater HS",
      ethnicity: "Syrian/American",
      race: "White",
      gender: "Male",
      gpa: 3.95,
      satScore: 2200,
      colleges: {
        reach: [{
          name: "University of Illinois",
          location: "Urbana, IL"
        },
        {
          name: "Georgia Tech",
          location: "Atlanta, GA"
        }],
        match: [{
          name: "Arizona State University",
          location: "Tempe, AZ"
        }]
      },
      hobbies: "Coding, Video Games",
      extracurriculars: "NHS, SkillsUSA, spending way too much time coding"
    }
  };

  render () {
    return (
      <MenteeDetails mentee={this.state.mentee} />
    )
  }
}

export default MenteeDetailsView
