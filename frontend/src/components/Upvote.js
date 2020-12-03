import React, { Component, Fragment } from 'react';

class Upvote extends Component {
  constructor(props) {
    super(props);
  }

  upvote = (event) => {
    this.props.likeQuestion();
  };

  unvote = (event) => {
    this.props.unlikeQuestion();
  };

  render() {
    const show = this.props.voted ? (
      <button onClick={this.unvote}>Unvote</button>
    ) : (
      <button onClick={this.upvote}>Upvote</button>
    );

    return <Fragment>{show}</Fragment>;
  }
}

export default Upvote;
