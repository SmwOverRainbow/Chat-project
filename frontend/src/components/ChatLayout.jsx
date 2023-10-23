import React, {
  useEffect, useContext, useState,
} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Container, Row, Col, Button, Spinner,
} from 'react-bootstrap';
import Channels from './Channels.jsx';
import ChatBody from './ChatBody.jsx';
import ModalWrapper from './modalWindow/ModalWrapper.jsx';
import { addManyChannels } from '../slices/channelsSlice.js';
import { addManyMessages } from '../slices/messagesSlice.js';
import { AuthContext } from '../context/authContext.js';
import { pathTo } from '../utils/helpers.js';
import { ReactComponent as AddChannelIcon } from '../images/addChannel.svg';
import { showWindow } from '../slices/modalSlice.js';

const ChatLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, logOut } = useContext(AuthContext);
  const { t } = useTranslation();

  const getData = async (requestToken) => {
    const response = await axios.get(pathTo.getData(), { headers: { Authorization: `Bearer ${requestToken}` } });
    return response.data;
  };

  const channels = useSelector((state) => state.channels);
  const [isSpinnerShow, setIsSpinnerShow] = useState(false);

  useEffect(() => {
    setIsSpinnerShow(true);
    if (!token) {
      navigate('login', { replace: false });
    }
    getData(token)
      .then((data) => {
        setIsSpinnerShow(false);
        dispatch(addManyChannels(data.channels));
        dispatch(addManyMessages(data.messages));
      })
      .catch((e) => {
        if (e.response.status === 401) {
          logOut();
          navigate('login', { replace: false });
        }
      });
  }, [navigate, dispatch, channels.currentChannelId, token, logOut]);

  const handleClickAddChannel = () => dispatch(showWindow({ type: 'addChannel' }));

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <ModalWrapper />
      <Row className="h-100 bg-white flex-md-row">
        <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>{t('chatLayout.channels')}</b>
            <Button
              type="button"
              variant=""
              className="p-0 text-primary btn-group-vertical"
              onClick={handleClickAddChannel}
            >
              <AddChannelIcon />
              <span className="visually-hidden">+</span>
            </Button>
          </div>
          <Channels />
        </Col>
        <Col className="p-0 h-100">
          {isSpinnerShow
            ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )
            : <ChatBody />}
        </Col>
      </Row>
    </Container>
  );
};

export default ChatLayout;
