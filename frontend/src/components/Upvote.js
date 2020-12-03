import React, { Component, Fragment } from 'react';

class Upvote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: props.uid,
      qid: props.qid,
      voted: props.voted,
      numvotes: props.numvotes,
    };
  }

  likeQuestion = (event) => {
    event.preventDefault();
    const like = {
      uid: this.state.uid,
    };
    console.log(this.state);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(like),
    };
    fetch(`http://localhost:8000/like/${this.state.qid}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log({ errors: data.error });
        } else {
          // this.setState((prevState) => {
          //   return { voted: true, numvotes: prevState.numvotes + 1 };
          // });
          console.log('Okay');
        }
      })
      .catch((err) => console.log({ errors: err }));
  };

  unlikeQuestion = (event) => {
    event.preventDefault();
    const unlike = {
      uid: this.state.uid,
    };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(unlike),
    };
    fetch(`http://localhost:8000/unlike/${this.state.qid}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log({ errors: data.error });
        } else if (data.message) {
          this.setState({ voted: false, numvotes: this.state.numvotes - 1 });
        }
      })
      .catch((err) =>
        console.log({ errors: 'Something went wrong. Please try again.' })
      );
  };

  render() {
    const show = this.state.voted ? (
      <button onClick={this.unlikeQuestion}>Unvote </button>
    ) : (
      <button onClick={this.likeQuestion}>Upvote </button>
    );

    return (
      <Fragment>
        {show}
        <span>({this.state.numvotes})</span>
      </Fragment>
    );
  }
}

export default Upvote;
