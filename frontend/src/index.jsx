import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { io } from 'socket.io-client';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { SocketEmitContextProvider } from './context/socketEmitContext.js';
import { AuthContextProvider } from './context/authContext.js';
import './index.css';
import init from './init.js';
import store from './slices/index.js';
import App from './components/App.jsx';
import 'react-toastify/dist/ReactToastify.css';

const app = async () => {
  const socket = io();
  await init(socket);

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
    environment: 'production',
  };

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary>
          <ReduxProvider store={store}>
            <AuthContextProvider>
              <SocketEmitContextProvider socket={socket}>
                <App />
                <ToastContainer />
              </SocketEmitContextProvider>
            </AuthContextProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </RollbarProvider>
    </React.StrictMode>,
  );
};

app();
