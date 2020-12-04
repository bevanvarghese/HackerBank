import React, { Component } from 'react';

class AnswerForm extends Component {
  constructor(props) {
    super(props);

    this.makeActive = this.makeActive.bind(this);
    this.makeinActive = this.makeinActive.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      uid: props.uid,
      uname: props.uname,
      qid: props.qid,
      active: false,
      content: '',
      errors: '',
    };
  }

  makeActive = (event) => {
    this.setState({ active: true });
  };

  makeinActive = (event) => {
    event.preventDefault();
    this.setState({ active: false });
  };

  handleChange = (event) => {
    this.setState({ content: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.content != '') {
      const answer = {
        content: this.state.content,
        creatorId: this.state.uid,
        creatorName: this.state.uname,
      };
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answer),
      };
      const qid = this.state.qid;
      console.log(`http://localhost:8000/answers/create/${qid}`);
      fetch(`http://localhost:8000/answers/create/${qid}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            this.setState({ errors: data.error });
          } else if (data.message) {
            this.setState({ errors: '', content: '', active: false });
            window.location.reload();
          }
        })
        .catch((err) =>
          this.setState({ errors: 'Something went wrong. Please try again.' })
        );
    } else {
      this.setState({ errors: 'Cannot be empty' });
    }
  };

  render() {
    const show = this.state.active ? (
      <div>
        <form>
          <textarea
            id='content'
            name='content'
            rows='4'
            cols='50'
            value={this.state.content}
            onChange={this.handleChange}
          />
          <p style={{ color: 'red' }}>{this.state.errors}</p>
          <br />
          <button className='editQuestionButton' onClick={this.handleSubmit}>
            Submit
          </button>
          <button
            className='editQuestionButton'
            style={{ marginLeft: '10px' }}
            onClick={this.makeInactive}
          >
            Cancel
          </button>
        </form>
      </div>
    ) : (
      <div className='Placeholder' onClick={this.makeActive}>
        <p>Post your new answer...</p>
      </div>
    );

    return (
      <div className='answerForm'>
        <div className='answerHead'>
          <span className='creator'>{this.state.uname}</span>
        </div>
        {show}
      </div>
    );
  }
}

export default AnswerForm;
