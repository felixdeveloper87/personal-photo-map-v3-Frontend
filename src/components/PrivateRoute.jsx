// /**
//  * PrivateRoute Component
//  * 
//  * This component acts as a wrapper for routes that require authentication.
//  * It checks if a valid authentication token exists in localStorage.
//  * If the token is present, it renders the specified component.
//  * If not, it redirects the user to the login page.
//  */


// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';

// const PrivateRoute = ({ component: Component, ...rest }) => {
//   // Retrieve authentication token from localStorage
//   const token = localStorage.getItem('token');

//   return (
//     <Route
//       {...rest} // Pass any additional props to the Route component
//       render={props =>
//         token ? (
//           // If token exists, render the requested component with its props
//           <Component {...props} />
//         ) : (
//           // If token is missing, redirect the user to the login page
//           <Redirect to="/login" />
//         )
//       }
//     />
//   );
// };

// export default PrivateRoute;
