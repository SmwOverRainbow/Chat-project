// import { useEffect } from 'react';
import React, { useEffect } from 'react';
import { /*Outlet,*/ useNavigate } from 'react-router-dom';

const MainPage = () => {
// const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // console.log('Current location is ', location);
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('login', { replace: false });
    }
  }, [navigate]);

  return (
    <>
      <div> Chat Page </div>
      {/* <Outlet /> */}
    </>
  )
};

export default MainPage;