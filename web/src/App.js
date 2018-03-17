import React, { Component } from 'react';
import MenteeList from './MenteeList';
//import Navigation from './Navigation';
import MockMentees from './MockMentees';

console.log(MockMentees);

class App extends Component {
  render() {
    return (
      <div>
        <MenteeList mentees={MockMentees} />
        {/* <Navigation /> */}
      </div>
    );
  }
}

export default App;
