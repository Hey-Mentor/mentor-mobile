import React, { Component } from 'react';
import MenteeList from './MenteeList';
//import MenteeService from './MenteeService';

class App extends Component {

  constructor(props) {
    super(props);
  }

  state = {};

  async componentDidMount() {
    const data = fetch('https://hey-mentor-api1.herokuapp.com/mentees/testMentorId')
      .then(res => res.json())
      .then(res => {
        return res
      });
    const something = await data;
  
    this.setState({
      mentees: something
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
