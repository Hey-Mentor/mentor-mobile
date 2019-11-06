import React, { Component } from 'react';
import {
  ScrollView, View, StyleSheet
} from 'react-native';
import DetailsHeader from './DetailsHeader.js';
import DetailRow from './DetailRow.js';
import DetailSectionHeader from './DetailSectionHeader.js';
import BubbleList from './BubbleList.js';
import { CONFIG } from '../../config.js';

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
        <DetailsHeader image={{ uri: `${CONFIG.FACEBOOK_PROFILE_LINK.PREFIX}${mentee.facebook_id}${CONFIG.FACEBOOK_PROFILE_LINK.SUFFIX}` }} delay={this.props.messageDelta} mentee={mentee} />
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

export default MenteeDetails;
