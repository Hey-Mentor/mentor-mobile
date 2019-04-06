import React, { Component } from 'react';
import {
  ScrollView, View, Text, StyleSheet
} from 'react-native';
import DetailsHeader from './DetailsHeader.js';
import DetailRow from './DetailRow.js';
import DetailSectionHeader from './DetailSectionHeader.js';
import BubbleList from './BubbleList.js';
import CollegeList from './CollegeList.js';

class MenteeDetails extends Component {
  render() {
    const mentee = this.props.mentee;

    const supportAreas = [
      { name: 'College applications', highlight: false },
      { name: 'Scholarships', highlight: false },
      { name: 'Financial aid', highlight: false },
      { name: 'College search', highlight: false },
      { name: 'Career advice', highlight: true },
      { name: 'Exam preparation', highlight: false }
    ];

    const styles = StyleSheet.create({
      scrollView: {
        backgroundColor: '#F2F2F2'
      },
      detailSectionList: {
        paddingBottom: 20
      },
      detailSectionInfo: {
        backgroundColor: '#ffffff',
        paddingBottom: 15,
        paddingTop: 15,
        paddingLeft: 16,
        paddingRight: 0,
        marginBottom: 24
       }
    });

    return (
      <ScrollView style={styles.scrollView}>
        <DetailsHeader image="https://www.w3schools.com/howto/img_avatar.png" delay="0 days" mentee={mentee} />
        <View id="detailSectionList" style={styles.detailSectionList}>

          <DetailSectionHeader title="Score" />
          <View style={styles.detailSectionInfo}>
              <DetailRow name="GPA" value={mentee.school.gpa} />
              <DetailRow name="SAT" value={mentee.school.sat} last="true" />
          </View>

          <DetailSectionHeader title="Bio" />
          <View style={styles.detailSectionInfo}>
            <DetailRow wide name="Interests" value={mentee.gen_interest} />
            <DetailRow wide name="Activities" value={mentee.spec_interests.join(', ')} />
            <DetailRow wide name="Sports" value={mentee.sports.join(', ')} last="true" />
          </View>

          <DetailSectionHeader title="Areas of support" />
          <View style={styles.detailSectionInfo}>
            <BubbleList items={supportAreas} />
          </View>

          <DetailSectionHeader title="Demographics" />
          <View style={styles.detailSectionInfo}>
              <DetailRow name="Gender" value={mentee.demo.gender} />
              <DetailRow name="Race" value={mentee.demo.race} />
              <DetailRow name="Ethnicity" value={mentee.demo.eth} last="true" />
          </View>
        </View>
      </ScrollView>
    );
  }
}

/*
[{
    "person": {
      "fburl": "URL",
      "fname": "Christophe",
      "kname": "Chri (Pronounced Cree)",
      "lname": "Smith-Hernandez"
    },
    "demo": {
      "eth": "Filipino",
      "gender": "Female",
      "race": "Asian/Asian American"
    },
    "school": {
      "gpa": "3.6",
      "grade": "11th Grade",
      "name": "Summit Public Schools: Sierra",
      "sat": ""
    },
    "spec_interests": [],
    "sports": ["Frisbee", "Hiking", "Volleyball"],
    "support": ["Admission Essays, Career Prep (Resume, Cover Letter, LinkedIn, Interviews), Choosing Post-Secondary Plans, Financial Aid, Finding Scholarships"],
    "created_date": "2018-06-30T23:03:47.433Z",
    "_id": "5b37f7b6fb6fc03328f73456",
    "gen_interest": "Sciences: Biology, Chemistry, or Physics",
    "mentee_id": "zleldwwzztm8526icywg",
    "mentor_id": "",
    "spec_interest": ["Arts", "Baking", "Camping", "Coffee & tea", "Cooking", "Eating", "Exercise", "Movies", "Music", "Photography", "Shopping", "Travel"]
  }
]


[
{
    "status": ["pending"],
    "created_date": "2018-06-26T20:02:22.038Z",
    "_id": "5aef5f11f36d2837eae6a7e8",
    "mentor_id": "bdkenslvl",
    "mentee_id": "znenjkels",
    "person":
    {
        "fname": "Kevin",
        "lname": "Truong",
        "kname": "KevvyKev",
        "fburl": "kevtruong"
    },
    "demo":
    {
        "gender": "male",
        "race": "asian",
        "eth": "vietnamese"
    },
    "school":
    {
        "name": "Garfield High School",
        "grade": "Senior",
        "gpa": 3.9,
        "sat": 1600,
        "act": 28
    },
    "hobbies": ["dancing", "swimming"],
    "extracurric": "debate team",
    "support": ["Essays", "Scholarships"]
}]


*/

export default MenteeDetails;
