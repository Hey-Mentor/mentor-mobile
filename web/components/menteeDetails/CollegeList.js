import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'

class CollegeList extends Component {
  render() {

    const styles = StyleSheet.create({
      collegeClass: {
        color: "#000000",
        paddingRight: 7,
        paddingBottom: 10,
        fontWeight: "bold",
        width: 84
      },
      collegeSection: {
        paddingBottom: 8,
        marginLeft: 16
      },
      collegeDetails: {
        color: "#4f4f4f"
      }
    });

    // Construct college list
    const colleges = [];
    this.props.colleges.forEach((college, idx) => {
      colleges.push(
        <View key={ idx }>
          <Text style={styles.collegeDetails}>{ college.name }</Text>
          <Text style={styles.collegeDetails}>{ college.location }</Text>
        </View>
      );
    });

    // Wrap college list (or return null, if no colleges are specified)
    if (this.props.colleges.length > 0) {
      return (
        <View style={styles.collegeSection}>
          <Text style={styles.collegeClass}>{this.props.collegeClass}</Text>
          { colleges }
        </View>
      );
    } else {
      return null;
    }
  }
}

export default CollegeList;
