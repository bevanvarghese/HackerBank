import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class NavBack extends Component {
  render() {
    const style = {
      backgroundColor: 'lightGray',
      width: '100%',
    };

    return (
      <div style={style}>
        <Link to='/'>back</Link>
      </div>
    );
  }
}

export default NavBack;
