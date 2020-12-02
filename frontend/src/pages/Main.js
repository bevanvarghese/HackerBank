import React, { Component } from 'react';

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
      expandedQuestionId: '',
    };
  }

  logout = (event) => {
    localStorage.clear();
  };

  render() {
    return (
      <div>
        Heyo dis the main page
        {localStorage.getItem('uid') !== null && (
          <button onClick={this.logout}>Log out</button>
        )}
      </div>
    );
  }
}

export default Main;
