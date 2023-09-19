// import logo from './logo.svg';
// import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from './Login.jsx';
import MainPage from './Chat.jsx';
import NotFound from './NotFound.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
