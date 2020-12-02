import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

const UnAuthRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem('uid') === null ? (
        <Component {...props} />
      ) : (
        <Redirect to='/' />
      )
    }
  />
);

export default UnAuthRoute;
