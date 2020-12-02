import React, { Component, Fragment } from 'react';
import NavBack from '../components/NavBack';

class Ask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      space: '',
      content: '',
      errors: '',
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSelect = (event) => {
    this.setState({
      space: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state.space);
    const question = {
      title: this.state.title,
      space: this.state.space,
      content: this.state.content,
      creatorId: localStorage.getItem('uid'),
      creatorName: localStorage.getItem('uname'),
    };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question),
    };

    if (
      question.title == '' ||
      question.space == '' ||
      question.content == ''
    ) {
      this.setState({ errors: 'Fields cannot be empty.' });
    } else {
      this.setState({ errors: '' });
      fetch('http://localhost:8000/questions/create', requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            this.setState({ errors: data.error });
          } else if (data.message) {
            this.props.history.push('/');
          }
        })
        .catch((err) =>
          this.setState({ errors: 'Something went wrong. Please try again.' })
        );
    }
  };

  render() {
    return (
      <Fragment>
        <NavBack />
        <div className='formContainer'>
          <h2>Ask your question</h2>
          <form>
            Title
            <br />
            <input
              type='text'
              id='title'
              name='title'
              value={this.state.title}
              onChange={this.handleChange}
              required
            />
            <br />
            <br />
            Space
            <br />
            <input
              type='radio'
              name='space'
              value='Algorithm'
              onClick={this.handleSelect}
              required
            />
            Algorithm
            <input
              type='radio'
              name='space'
              value='Machine Learning'
              onClick={this.handleSelect}
              required
            />
            Machine Learning
            <input
              type='radio'
              name='space'
              value='System'
              onClick={this.handleSelect}
              required
            />
            System
            <input
              type='radio'
              name='space'
              value='Javascript'
              onClick={this.handleSelect}
              required
            />
            Javascript
            <br />
            <br />
            Content
            <br />
            <textarea
              id='content'
              name='content'
              rows='4'
              cols='50'
              value={this.state.content}
              onChange={this.handleChange}
              required
            />
            <br />
            <br />
            <button onClick={this.handleSubmit}>Submit</button>
          </form>
          <p style={{ color: 'red' }}>{this.state.errors}</p>
        </div>
      </Fragment>
    );
  }
}

export default Ask;
