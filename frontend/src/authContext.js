import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({});

// export const authObject = {
//   token: () => localStorage.getItem('token'),
//   isLoggedIn: () => Boolean(authObject.token()),
//   logOut: () => localStorage.removeItem('token'),
//   logIn: (responseToken) => localStorage.setItem('token', responseToken),
  // setCurrentUser: (user) => authObject.currentUser = user,
  // currentUser: null,
// };


export const AuthContextProvider = (props) => {
  const [token, setToken] = useState('');

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
      },
    logIn: (responseToken) => {
      localStorage.setItem('token', responseToken);
      setToken(responseToken);
      },
    // setCurrentUser: (user) => authObject.currentUser = user,
    // currentUser: null,
  };

  return (
    <AuthContext.Provider value={ authObject }>{ props.children }</AuthContext.Provider>
  );
}
