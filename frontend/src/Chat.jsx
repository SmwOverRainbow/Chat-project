import React, { useEffect } from 'react';
import axios from 'axios';
import { /*Outlet,*/ useNavigate } from 'react-router-dom';

const MainPage = () => {
// const location = useLocation();
  const navigate = useNavigate();
  const getData = async (token) => {
    try {
      const responce = await axios.get('/api/v1/data', {headers: {Authorization: `Bearer ${token}`}});
      console.log('here', responce);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('login', { replace: false });
    } else {
      getData(token);
    }
  }, [navigate]);

  return (
    <>
      <div> Chat Page </div>
    </>
  )
};

export default MainPage;