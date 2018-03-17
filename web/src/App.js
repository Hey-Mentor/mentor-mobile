import React, { Component } from 'react';
import MenteeList from './MenteeList';
//import MenteeService from './MenteeService';

class App extends Component {

  constructor(props) {
    super(props);
  }

  state = {};

  async componentDidMount() {
    const res = await fetch('https://hey-mentor-api1.herokuapp.com/mentees/testMentorId');
    const something = await res.json();
  
    this.setState({
      mentees: [something]
    });
  }
  
  render() {
    return (
      <div>
        <MenteeList mentees={this.state.mentees || []} />
        {/* <Navigation /> */}
      </div>
    );
  }
}

export default App;
