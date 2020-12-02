import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem('uid') === null ? (
        <Redirect to='/login' />
      ) : (
        <Component {...props} />
      )
    }
  />
);

export default AuthRoute;
