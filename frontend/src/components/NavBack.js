import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class NavBack extends Component {
  render() {
    const divStyle = {
      backgroundColor: 'lightblue',
      width: '100%',
      height: '5vw',
    };
    const linkStyle = {
      color: 'blue',
      textDecoration: 'none',
      ':hover': {
        textDecoration: 'underline',
      },
    };

    return (
      <div style={divStyle}>
        <Link to='/' style={linkStyle}>
          back
        </Link>
      </div>
    );
  }
}

export default NavBack;
