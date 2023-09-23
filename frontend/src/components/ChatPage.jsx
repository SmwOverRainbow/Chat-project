import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addManyChannel } from '../slices/channelsSlice.js';
import { addManyMessage } from '../slices/messagesSlice.js';

const ChatPage = () => {
// const location = useLocation();
  const navigate = useNavigate();
  const getData = async (token) => {
    // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const responce = await axios.get('/api/v1/data', { headers: { 'Authorization': `Bearer ${token}` }});
      console.log('responce', responce);
      return responce.data;
    } catch (e) {
      console.error(e);
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getData(token)
        .then((data) => {
          dispatch(addManyChannel(data.channels));
          dispatch(addManyMessage(data.messages));
        })
    } else {
      navigate('login', { replace: false });
    }
  }, [navigate, dispatch]);

  const channels = useSelector((state) => state.channels);
  const messages = useSelector((state) => state.messages);

  return (
    <div> Chat Page </div>
  )
};

export default ChatPage;