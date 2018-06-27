import React, { Component } from 'react';
import DetailsHeader from './DetailsHeader.js';
import DetailRow from './DetailRow.js';
import DetailSectionHeader from './DetailSectionHeader.js';
import BubbleList from './BubbleList.js';
import CollegeList from './CollegeList.js';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

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
        <DetailsHeader image="https://www.w3schools.com/howto/img_avatar.png" delay="0 days" />
        <View id="detailSectionList" style={styles.detailSectionList}>
          <DetailSectionHeader title="Demographics" />
          <DetailRow name="Gender" value={mentee.demo.gender} />
          <DetailRow name="Race" value={mentee.demo.race} />
          <DetailRow name="Ethnicity" value={mentee.demo.ethnicity} />

          <DetailSectionHeader title="School" />
          <DetailRow name="High School" value={mentee.school.name} />
          <DetailRow name="Year" value={mentee.school.grade} />
          <DetailRow name="GPA" value={mentee.school.gpa} />
          <DetailRow name="SAT" value={mentee.school.satScore} />

          <DetailSectionHeader title="Bio" />
          <DetailRow wide name="Hobbies" value={mentee.hobbies} />
          <DetailRow wide name="Extracurricular Activities" value={mentee.extracurriculars} />

          <DetailSectionHeader title="Areas of support" />
          <BubbleList items={supportAreas} />
        </View>
      </ScrollView>
    );
  }
}

/*
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
