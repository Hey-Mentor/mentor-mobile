import React, { Component } from 'react';
import DetailsHeader from './DetailsHeader.js'
import DetailRow from './DetailRow.js'
import DetailSectionHeader from './DetailSectionHeader.js'
import BubbleList from './BubbleList.js'
import CollegeList from './CollegeList.js'

import { ScrollView, View, Text, StyleSheet } from 'react-native'

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
        <View id="detailSectionList" style={styles.detailSectionList} >
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

          <DetailSectionHeader title="Bio" />
          <DetailRow wide={true} name="Hobbies" value={mentee.hobbies} />
          <DetailRow wide={true} name="Extracurricular Activities" value={mentee.extracurriculars} />
          
          <DetailSectionHeader title="Areas of support" />
          <BubbleList items={supportAreas} />
        </View>
      </ScrollView>
    );
  }
}

export default MenteeDetails;
