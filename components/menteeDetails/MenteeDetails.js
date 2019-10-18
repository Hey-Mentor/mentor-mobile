import React, { Component } from 'react';
import {
  ScrollView, View, StyleSheet
} from 'react-native';
import DetailsHeader from './DetailsHeader.js';
import DetailRow from './DetailRow.js';
import DetailSectionHeader from './DetailSectionHeader.js';
import BubbleList from './BubbleList.js';

class MenteeDetails extends Component {
  render() {
    const { mentee } = this.props;

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
        backgroundColor: '#ffffff'
      },
      detailSectionList: {
        marginLeft: 21,
        marginRight: 20,
        paddingBottom: 20
      }
    });

    return (
      <ScrollView style={styles.scrollView}>
        <DetailsHeader image= {{ uri: 'https://graph.facebook.com/' + mentee.facebook_id + '/picture?type=large',  }} delay={this.props.messageDelta} mentee={mentee} />
        <View id="detailSectionList" style={styles.detailSectionList}>
          <DetailSectionHeader title="Demographics" />
          <DetailRow name="Gender" value={mentee.demo.gender} />
          <DetailRow name="Race" value={mentee.demo.race} />
          <DetailRow name="Ethnicity" value={mentee.demo.eth} />

          <DetailSectionHeader title="School" />
          <DetailRow name="High School" value={mentee.school.name} />
          <DetailRow name="Year" value={mentee.school.grade} />
          <DetailRow name="GPA" value={mentee.school.gpa} />
          <DetailRow name="SAT" value={mentee.school.sat} />

          <DetailSectionHeader title="Bio" />
          <DetailRow wide name="Interests" value={mentee.gen_interest} />
          <DetailRow wide name="Activities" value={mentee.spec_interests.join(', ')} />
          <DetailRow wide name="Sports" value={mentee.sports.join(', ')} />

          <DetailSectionHeader title="Areas of support" />
          <BubbleList items={supportAreas} />
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
