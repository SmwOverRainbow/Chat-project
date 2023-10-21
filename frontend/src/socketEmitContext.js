import React, { createContext } from 'react';

export const SocketEmitContext = createContext({});

export const SocketEmitContextProvider = (props) => {
  const { socket, children } = props;
  const clarify = (...arg) => new Promise((resolve, reject) => {
    socket.timeout(5000).emit(...arg, (err, response) => (response?.status === 'ok' ? resolve(response?.data) : reject(err)));
  });

  return (
    <SocketEmitContext.Provider value={clarify}>{ children }</SocketEmitContext.Provider>
  );
};
