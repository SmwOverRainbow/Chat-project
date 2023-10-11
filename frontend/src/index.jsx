import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { AuthContextProvider } from './authContext.js';
import './index.css';
import init from './init.js';
import store from './slices/index.js';
import App from './App';

const app = async () => {
  await init();

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
      </Provider>
    </React.StrictMode>
  );
};

app();
