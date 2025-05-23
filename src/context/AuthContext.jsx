/**
 * AuthProvider Component
 * This component acts as a wrapper that holds authentication-related state and methods.
 * It provides the following:
 *  - Authentication status (isLoggedIn)
 *  - User's full name (fullname)
 *  - User's email (email)
 *  - Premium status (isPremium)
 *  - Methods to log in, log out, and update the premium status
 * 
 * The context's state is kept in sync with localStorage to persist data across browser sessions.
 * 
 */

import React, { createContext, useState } from 'react';

/**
 * AuthContext
 * This context is used to manage and provide authentication information throughout the application.
 * Exporting it allows any consumer to use AuthContext in other components.
 */
export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  /**
   * Determines if a user is logged in by checking the presence of a "token" in localStorage.
   * This ensures that if a token exists, the state initializes as logged in.
   */
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  /**
   * Stores the user's full name from localStorage, or defaults to an empty string if not found.
   */
  const [fullname, setFullname] = useState(localStorage.getItem('fullname') || '');

  /**
   * Stores the user's email address from localStorage, or defaults to an empty string if not found.
   */
  const [email, setEmail] = useState(localStorage.getItem('email') || '');

  /**
   * Determines if a user is a premium user by checking the "premium" value in localStorage.
   * The initial state is converted to a boolean, avoiding issues on the first render.
   */
  const [isPremium, setIsPremium] = useState(() => {
    return localStorage.getItem('premium') === 'true';
  });

  /**
   * login
   * Handles the process of storing new authentication data (token, fullname, email, premium) both
   * in localStorage and in the component state. It also triggers a 'storage' event to notify
   * any other listeners (e.g., other browser tabs) of changes in localStorage.
   *
   */
  const login = (data) => {
    console.log("Data received in login function:", data);

    if (typeof data !== "object") {
      console.error("Error: login data is not a valid object!", data);
      return;
    }

    const { token, fullname, email, premium } = data;

    // Convert 'premium' to a boolean if it is a string, otherwise check its boolean value
    const isPremiumUser = premium === true || premium === "true";

    // Store user data in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('fullname', fullname);
    localStorage.setItem('email', email);
    localStorage.setItem('premium', isPremiumUser ? "true" : "false");

    // Update state to reflect authenticated status
    setIsLoggedIn(true);
    setFullname(fullname);
    setEmail(email);
    setIsPremium(isPremiumUser);

    console.log("Premium status on the frontend after login:", isPremiumUser);

    // Dispatch a storage event to notify other browser tabs or components
    window.dispatchEvent(new Event('storage'));
  };

  /**
   * logout
   * Handles the logout process by removing user-related data from localStorage,
   * resetting the relevant states, and dispatching a 'storage' event to inform
   * other parts of the application of the change.
   */
  const logout = () => {
    // Remove user credentials from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('fullname');
    localStorage.removeItem('email');
    // localStorage.setItem('premium', "false"); // Uncomment if needed

    // Reset the local state to reflect that the user is no longer logged in
    setIsLoggedIn(false);
    setFullname('');
    setEmail('');
    // setIsPremium(false); // Uncomment if you want to reset premium status on logout

    // Dispatch a storage event to notify other components or tabs
    window.dispatchEvent(new Event('storage'));
  };

  /**
   * updatePremiumStatus
   * Updates the premium status in both localStorage and the component state.
   *
   * @param {boolean|string} status - The new premium status to be set. Can be a boolean or a string.
   */
  const updatePremiumStatus = (status) => {
    const statusStr = String(status);
    localStorage.setItem('premium', statusStr);
    setIsPremium(statusStr === 'true');
    console.log("Premium status updated to:", statusStr);
  };

  /**
   * Render a Provider that makes all state variables and functions
   * available to any child components through the AuthContext.
   */
  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        isPremium, 
        fullname, 
        email, 
        login, 
        logout, 
        updatePremiumStatus 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
