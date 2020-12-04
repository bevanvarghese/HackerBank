import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import NavBack from '../components/NavBack';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errors: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);

    const loginData = {
      email: this.state.email,
      password: this.state.password,
    };
    let emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    };

    if (loginData.email == '' || loginData.password == '') {
      this.setState({ errors: 'Fields cannot be empty.' });
    } else if (!emailRegEx.test(this.state.email)) {
      this.setState({ errors: 'Please enter a valid email.' });
    } else {
      this.setState({ errors: '' });
      fetch('http://localhost:8000/login', requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            this.setState({ errors: data.error });
          } else if (data.message) {
            localStorage.setItem('uid', data.uid);
            localStorage.setItem('uname', data.uname);
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
        <div className='navBack'>
          <button
            onClick={() => this.props.history.push('/')}
            className='navBackLink'
            to='/'
          >
            Back
          </button>
        </div>
        <div className='outer'>
          <div className='middle'>
            <div className='inner'>
              <div className='formContainer'>
                <p className='formTitle'>Sign In</p>
                <form>
                  <div className='formItem'>
                    <label className='formLabel' for='email'>
                      Email:
                    </label>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      placeholder='Email'
                      value={this.state.email}
                      onChange={this.handleChange}
                      className='formInput'
                      required
                    />
                  </div>
                  <div className='formItem'>
                    <label className='formLabel' for='password'>
                      Password:
                    </label>
                    <input
                      id='password'
                      name='password'
                      type='password'
                      placeholder='Password'
                      value={this.state.password}
                      onChange={this.handleChange}
                      className='formInput'
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
                    Log In
                  </button>
                </form>
              </div>

              <p>Do not have an account?</p>
              <button
                className='formButton'
                onClick={() => this.props.history.push('/register')}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Login;
