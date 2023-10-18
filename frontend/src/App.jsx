import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Layout from './components/Layout.jsx';
import Login from './components/Login.jsx';
import ChatPage from './components/ChatPage.jsx';
import NotFound from './components/NotFound.jsx';
import Signup from './components/Signup.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<ChatPage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
