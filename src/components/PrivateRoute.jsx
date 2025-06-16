// /**
//  * PrivateRoute Component
//  * 
//  * This component acts as a wrapper for routes that require authentication.
//  * It checks if a valid authentication token exists in localStorage.
//  * If the token is present, it renders the specified component.
//  * If not, it redirects the user to the login page.
//  */


// src/components/PrivateRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  return isLoggedIn ? children : <Navigate to="/welcome" replace />;
};

export default PrivateRoute;
