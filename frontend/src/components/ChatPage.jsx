import React, { useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Container, Row, Col, Dropdown, ButtonGroup, Nav, Button, InputGroup, Form,
} from 'react-bootstrap';
import ModalWrapper from './modalWindow/ModalWrapper.jsx';
import {
  addManyChannels, setCurrentChannelId,
} from '../slices/channelsSlice.js';
import { addManyMessages } from '../slices/messagesSlice.js';
import { SocketEmitContext } from '../socketEmitContext.js';
import { AuthContext } from '../authContext.js';
import { notifyError } from '../utils/toasts.js';
import { getData, getCensoredMessage } from '../utils/helpers.js';
import { ReactComponent as AddChannelIcon } from '../images/addChannel.svg';
import { ReactComponent as AddMessageIcon } from '../images/addMessage.svg';
import { showWindow } from '../slices/modalSlice.js';

const ChatPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, username, logOut } = useContext(AuthContext);
  const clarify = useContext(SocketEmitContext);
  const { t } = useTranslation();
  const inputRef = useRef();
  const messagesContainerRef = useRef();

  const channels = useSelector((state) => state.channels);
  const messages = useSelector((state) => state.messages);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current.focus();
    });
  }, [channels.currentChannelId]);

  useEffect(() => {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  }, [messages.ids.length]);

  useEffect(() => {
    if (token) {
      getData(token)
        .then((data) => {
          dispatch(addManyChannels(data.channels));
          dispatch(addManyMessages(data.messages));
        })
        .catch((e) => {
          if (e.response.status === 401) {
            logOut();
            navigate('login', { replace: false });
          }
        });
    } else {
      navigate('login', { replace: false });
    }
  }, [navigate, dispatch, channels.currentChannelId, token, logOut]);

  const countMessages = messages.ids.reduce((acc, id) => {
    if (messages.entities[id].channelId === channels.currentChannelId) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const activeChannel = channels.entities[channels.currentChannelId];

  const formik = useFormik({
    initialValues: {
      message: '',
      channelId: 1,
      username,
    },
    onSubmit: (values, actions) => {
      // eslint-disable-next-line no-param-reassign
      values.channelId = channels.currentChannelId;
      if (values.message === '') {
        return null;
      }
      return clarify('newMessage', values)
        .then(() => {
          actions.resetForm();
        })
        .catch(() => {
          notifyError(t('chatPage.toasts.serverErr'));
        })
        .finally(() => actions.setSubmitting(false));
    },
  });

  const handleClickAddChannel = () => dispatch(showWindow({ type: 'addChannel', data: {} }));

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <ModalWrapper />
      <Row className="h-100 bg-white flex-md-row">
        <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>{t('chatPage.channels')}</b>
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
          <Nav id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
            {channels.ids.map((id) => {
              const channel = channels.entities[id];
              const classNamesActive = channel.id === channels.currentChannelId ? 'btn-secondary' : '';
              return (
                <Nav.Item className="w-100" key={id}>
                  <Dropdown as={ButtonGroup} className="d-flex mt-1">
                    <Button variant="" className={`w-100 rounded-0 text-start text-truncate ${classNamesActive}`} onClick={() => dispatch(setCurrentChannelId(channel.id))}>
                      <span className="me-1">#</span>
                      {channel.name}
                    </Button>
                    {channel.removable && (
                      <>
                        <Dropdown.Toggle aria-expanded="false" variant="" className={`flex-grow-0 dropdown-toggle-split ${classNamesActive}`}>
                          <span className="visually-hidden">{t('chatPage.labelManage')}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => dispatch(showWindow({ type: 'removeChannel', data: { id } }))}>
                            {t('chatPage.deleteDropdownBtn')}
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => dispatch(showWindow({ type: 'renameChannel', data: { name: channel.name, id } }))}>
                            {t('chatPage.renameDropdownBtn')}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </>
                    )}
                  </Dropdown>
                </Nav.Item>
              );
            })}
          </Nav>
        </Col>
        <Col className="p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b>
                  <span># </span>
                  {activeChannel ? activeChannel.name : 'general'}
                </b>
              </p>
              <span className="text-muted">{t('chatPage.messageCount.count', { count: countMessages })}</span>
            </div>
            <div ref={messagesContainerRef} id="messages-box" className="chat-messages overflow-auto px-5 ">
              {messages.ids.map((id) => {
                const message = messages.entities[id];
                if (message.channelId === activeChannel.id) {
                  return (
                    <div className="text-break mb-2" key={id}>
                      <b>{message.username}</b>
                      {`: ${getCensoredMessage(message.message)}`}
                    </div>
                  );
                }
                return null;
              })}
            </div>
            <div className="mt-auto px-5 py-3">
              <Form className="py-1 border rounded-2" onSubmit={formik.handleSubmit} noValidate>
                <InputGroup>
                  <Form.Control
                    autoFocus
                    name="message"
                    ref={inputRef}
                    className="border-0 p-0 ps-2 rounded-2"
                    type="text"
                    placeholder={t('chatPage.messagePlaceholder')}
                    aria-label={t('chatPage.messageLabel')}
                    onChange={formik.handleChange}
                    value={formik.values.message}
                    required
                  />
                  <Button type="submit" className="btn-group-vertical" variant="" disabled="">
                    <AddMessageIcon />
                    <span className="visually-hidden">{t('chatPage.btnSubmit')}</span>
                  </Button>
                </InputGroup>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;
