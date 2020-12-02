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
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state);
    if (this.state.email == '' || this.state.password == '') {
      this.setState({ errors: 'Fields cannot be empty.' });
    } else {
      let emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegEx.test(this.state.email)) {
        this.setState({ errors: 'Invalid email address entered.' });
      } else {
        this.setState({ errors: '' });
        const loginData = {
          email: this.state.email,
          password: this.state.password,
        };
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginData),
        };
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
    }
  };

  render() {
    return (
      <Fragment>
        <NavBack />
        <div className='formContainer'>
          <h2>SIGN IN</h2>
          <form>
            <input
              id='email'
              name='email'
              label='Email'
              type='email'
              value={this.state.email}
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
              value={this.state.password}
              placeholder='Password'
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
            <br />
            <button onClick={this.handleSubmit}>LOG IN</button>
          </form>
          <p style={{ color: 'red' }}>{this.state.errors}</p>
        </div>
        <p>Do not have an account?</p>
        <br />
        <button>
          <Link to='/register'>Register</Link>
        </button>
      </Fragment>
    );
  }
}

export default Login;
