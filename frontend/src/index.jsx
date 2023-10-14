import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { AuthContextProvider } from './authContext.js';
import './index.css';
import init from './init.js';
import store from './slices/index.js';
import App from './App.jsx';
import 'react-toastify/dist/ReactToastify.css';


const app = async () => {
  await init();

  const rollbarConfig = {
    accessToken: 'cec2258c5f3a484185e7742861fa0ca2',
    environment: 'testenv',
  };

  // const TestError = () => {
  //   const a = null;
  //   return a.hello();
  // };

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary>
          <ReduxProvider store={store}>
            <AuthContextProvider>
              {/* <TestError /> */}
              <App />
              <ToastContainer />
            </AuthContextProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </RollbarProvider>
    </React.StrictMode>
  );
};

app();
