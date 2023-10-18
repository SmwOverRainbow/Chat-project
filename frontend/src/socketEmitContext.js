import { createContext } from 'react';

export const SocketEmitContext = createContext({});

export const SocketEmitContextProvider = (props) => {
  const clarify = (...arg) => 
    new Promise((resolve, reject) => {
      props.socket.timeout(5000).emit(...arg, (err, response) => 
        (response?.status === 'ok' ? resolve(response?.data) : reject(err)));
  });

  return (
    <SocketEmitContext.Provider value={clarify}>{ props.children }</SocketEmitContext.Provider>
  );
}
