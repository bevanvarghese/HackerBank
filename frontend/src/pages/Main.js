import React, { Component } from 'react'

class Main extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      uid: '',
      uname: '',
      questions: [],
      space: '',
      sort: 'time',
      filter: '',
      expandedQuestionId: ''
    }
  }

  render() {
    return (
      <div>
        Heyo dis the main page
      </div>
    )
  }
};

export default Main;
