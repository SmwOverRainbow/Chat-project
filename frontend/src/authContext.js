import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext({});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem('token');
    setToken(tokenFromLocalStorage);
  }, []); 

  const authObject = {
    token: token,
    isLoggedIn: () => Boolean(token),
    logOut: () => {
      localStorage.removeItem('token');
      setToken('');
      setUsername('');
      },
    logIn: (responseToken, responseUsername) => {
      console.log('in auth context, token', responseToken);
      localStorage.setItem('token', responseToken);
      setToken(responseToken);
      setUsername(responseUsername);
      },
      getUsername: () => username,
    // setCurrentUser: (user) => {(authObject.currentUser = user)},
    
  };

  return (
    <AuthContext.Provider value={ authObject }>{ props.children }</AuthContext.Provider>
  );
}
