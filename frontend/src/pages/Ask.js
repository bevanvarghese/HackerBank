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

    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        {/* <NavBack /> */}
        <div className='navBack'>
          <a className='navBackLink' href='/'>
            Back
          </a>
        </div>
        <div className='outer'>
          <div className='middle'>
            <div className='inner innerException'>
              <div className='formContainer'>
                <p className='formTitle'>Ask your question</p>
                <form>
                  <div className='formItem'>
                    <label for='title' className='formLabel'>
                      Title
                    </label>
                    <input
                      className='formInput'
                      type='text'
                      id='title'
                      name='title'
                      value={this.state.title}
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div>
                    <br />
                    <label for='space' className='formLabel'>
                      Space
                    </label>
                    <br />
                    <input
                      type='radio'
                      name='space'
                      value='Algorithm'
                      onClick={this.handleSelect}
                      required
                    />
                    <span className='formRadio'>Algorithm</span>
                    <input
                      type='radio'
                      name='space'
                      value='Machine Learning'
                      onClick={this.handleSelect}
                      required
                    />
                    <span className='formRadio'>Machine Learning</span>
                    <input
                      type='radio'
                      name='space'
                      value='System'
                      onClick={this.handleSelect}
                      required
                    />
                    <span className='formRadio'>System</span>
                    <input
                      type='radio'
                      name='space'
                      value='JavaScript'
                      onClick={this.handleSelect}
                      required
                    />
                    <span className='formRadio'>JavaScript</span>
                    <br />
                    <br />
                  </div>
                  <div className='formItem'>
                    <label for='content' className='formLabel'>
                      Content
                    </label>
                    <textarea
                      className='formInput'
                      id='content'
                      name='content'
                      rows='4'
                      cols='70'
                      value={this.state.content}
                      onChange={this.handleChange}
                      required
                    />
                  </div>

                  {this.state.errors && (
                    <span class='formError'>
                      <br />
                      {this.state.errors}
                      <br />
                    </span>
                  )}
                  <br />
                  <button className='formButton' onClick={this.handleSubmit}>
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Ask;
