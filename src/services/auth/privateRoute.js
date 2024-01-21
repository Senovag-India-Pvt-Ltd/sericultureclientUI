// PrivateRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  /* Check if the user is authenticated (e.g., token in local storage) */
  let token = localStorage.getItem("jwtToken");
  const isAuthenticated = false;
  if(token != null && token != ""){
    isAuthenticated = true;
  }else{
    isAuthenticated = false;
  }
 
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
