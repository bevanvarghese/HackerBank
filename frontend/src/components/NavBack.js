import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

class NavBack extends Component {
  render() {
    return (
      <div className='navBack'>
        <Link className='navBackLink' to='/'>
          Back
        </Link>
      </div>
    );
  }
}

export default NavBack;
