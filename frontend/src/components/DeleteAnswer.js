import React, { Component } from 'react';

export class DeleteAnswer extends Component {
  constructor(props) {
    super(props);
  }

  deleteAnswer = (event) => {
    event.preventDefault();
    fetch(`http://localhost:8000/answers/delete/${this.props.aid}`, {
      method: 'DELETE',
    })
      .then((res) => res.json()) // or res.json()
      .then((res) => window.location.reload());
  };

  render() {
    return <button onClick={this.deleteAnswer}>delete</button>;
  }
}

export default DeleteAnswer;
