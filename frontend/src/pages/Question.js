import React, { Component, Fragment } from 'react';

class Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: '',
      uname: '',
      qid: '',
      space: '',
      title: '',
      content: '',
      time: '',
      askerId: '',
      askerName: '',
      answers: [],
      upvotes: [],
      answer: '',
    };

    const qid = this.props.match.params.qid;
    fetch(`http://localhost:8000/questions/${qid}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          this.setState({
            qid: data.qid,
            space: data.space,
            title: data.title,
            content: data.content,
            time: data.time,
            askerId: data.creatorId,
            askerName: data.creatorName,
            answers: data.answers,
            upvotes: data.upvotes,
          });
        }
        console.log(this.state.answers);
      })
      .catch((err) => console.log(err));
  }

  componentDidMount() {
    if (localStorage.getItem('uid') != null) {
      this.setState({
        uid: localStorage.getItem('uid'),
        uname: localStorage.getItem('uname'),
      });
    }
  }

  render() {
    return (
      <Fragment>
        <p>{this.state.qid}</p>
        <p>{this.state.space}</p>
        <p>{this.state.title}</p>
        <p>{this.state.content}</p>
        <p>{this.state.askerId}</p>
        <p>{this.state.askerName}</p>
        <p>{this.state.time}</p>
        <p>{this.state.uid}</p>
        <p>{this.state.uname}</p>
        {/* <p>{this.state.answers}</p>
        <p>{this.state.upvotes}</p> */}
        {this.state.uid == this.state.askerId ? (
          <p>You can edit/delete this </p>
        ) : (
          <p>Nah bro</p>
        )}
      </Fragment>
    );
  }
}

export default Question;
