import React, { createContext, useState, useMemo } from 'react';

export const AuthContext = createContext({});

export const AuthContextProvider = (props) => {
  const { children } = props;
  const tokenFromLocalStorage = localStorage.getItem('token');
  const usernameFromLocalStorage = localStorage.getItem('username');
  const [token, setToken] = useState(tokenFromLocalStorage);
  const [username, setUsername] = useState(usernameFromLocalStorage);

  const authObject = useMemo({
    token,
    isLoggedIn: () => Boolean(token),
    logOut: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setToken('');
      setUsername('');
    },
    logIn: (responseToken, responseUsername) => {
      localStorage.setItem('token', responseToken);
      localStorage.setItem('username', responseUsername);
      setToken(responseToken);
      setUsername(responseUsername);
    },
    username,
  });

  return (
    <AuthContext.Provider value={authObject}>{ children }</AuthContext.Provider>
  );
};
