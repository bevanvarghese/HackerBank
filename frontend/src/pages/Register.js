import React, { Component, Fragment } from 'react';
import NavBack from '../components/NavBack';

export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      cPassword: '',
      errors: '',
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);

    const user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      cPassword: this.state.cPassword,
    };
    let emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    };

    if (
      user.name == '' ||
      user.email == '' ||
      user.password == '' ||
      user.cPassword == ''
    ) {
      this.setState({ errors: 'Fields cannot be empty.' });
    } else if (!emailRegEx.test(this.state.email)) {
      this.setState({ errors: 'Please enter a valid email.' });
    } else if (user.password != user.cPassword) {
      this.setState({ errors: 'Passwords must match.' });
    } else {
      this.setState({ errors: '' });
      fetch('http://localhost:8000/register', requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            this.setState({ errors: data.error });
          } else if (data.message) {
            localStorage.setItem('uid', data.uid);
            localStorage.setItem('uname', user.name);
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
          <h2>Create an account</h2>
          <form>
            <input
              id='name'
              name='name'
              label='Name'
              type='text'
              placeholder='Name'
              value={this.state.name}
              onChange={this.handleChange}
              required
            />
            <br />
            <input
              id='email'
              name='email'
              label='Email'
              type='email'
              placeholder='Email'
              value={this.state.email}
              onChange={this.handleChange}
              required
            />
            <br />
            <input
              id='password'
              name='password'
              label='Password'
              type='password'
              placeholder='Password'
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
            <br />
            <input
              id='cPassword'
              name='cPassword'
              label='Confirm Password'
              type='password'
              placeholder='Confirm Password'
              value={this.state.cPassword}
              onChange={this.handleChange}
              required
            />
            <br />
            <button onClick={this.handleSubmit}>Register</button>
          </form>
          <p style={{ color: 'red' }}>{this.state.errors}</p>
        </div>
      </Fragment>
    );
  }
}

export default Register;
