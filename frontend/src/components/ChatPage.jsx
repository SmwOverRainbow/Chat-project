import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  Container, Row, Col, Dropdown, ButtonGroup, Nav, Button, InputGroup, Form,
} from 'react-bootstrap';
import ModalAddRename from './ModalAddRename.jsx';
import ModalRemove from './ModalRemove.jsx';
import { initSocket } from '../socket.js';
import {
  addManyChannels, addOneChannel, removeChannel, renameChannel, setCurrentChannel
  } from '../slices/channelsSlice.js';
import { addManyMessages, addOneMessage } from '../slices/messagesSlice.js';
import { AuthContext } from '../authContext.js';
import { notifySuccess, notifyError } from '../utils/toasts.js';
import { getData, getCensoredMessage } from '../utils/helpers.js';
import { ReactComponent as AddChannelIcon } from '../images/addChannel.svg';
import { ReactComponent as AddMessageIcon } from '../images/addMessage.svg';

let socket;

const ChatPage = () => {
// const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { /* token, */ getUsername } = useContext(AuthContext);
  // console.log('token in chat page', token);
  const { t } = useTranslation();

  const channels = useSelector((state) => state.channels);

  useEffect(() => {
    // console.log('token in chat page from auth', token);
    const tokenFromLS = localStorage.getItem('token');
    // console.log('token in chat page from localstorage', tokenFromLS);
    if (tokenFromLS) {
      socket = socket || initSocket();
      socket.on('newMessage', (message) => dispatch(addOneMessage(message)));
      socket.on('newChannel', (channel) => {
        dispatch(addOneChannel(channel));
      });
      socket.on('removeChannel', ({ id }) => {
        dispatch(removeChannel(id));
        if (id === channels.currentChannelId) {
          dispatch(setCurrentChannel(1));
        }
      });
      socket.on('renameChannel', (channel) => dispatch(renameChannel({ id: channel.id, changes: { name: channel.name }})));
      getData(tokenFromLS)
        .then((data) => {
          dispatch(addManyChannels(data.channels));
          dispatch(addManyMessages(data.messages));
        })
    } else {
      navigate('login', { replace: false });
    }
  }, [navigate, dispatch, channels.currentChannelId]);

  const messages = useSelector((state) => state.messages);
  // console.log('messages', messages);
  const countMessages = messages.ids.reduce((acc, id) => {
    if(messages.entities[id].channelId === channels.currentChannelId) {
      acc += 1;
    }
    return acc;
  }, 0);

  const activeChannel = channels.entities[channels.currentChannelId];

  const [showAddChannel, setShowAddChannel] = useState(false);
  const [renameChannelId, setRenameChannelId] = useState(null);
  const [removeChannelId, setRemoveChannelId] = useState(null);

  const formik = useFormik({
    initialValues: {
      message: '',
      channelId: 1,
      username: getUsername(),
    },
    onSubmit: (values, actions) => {
      values.channelId = channels.currentChannelId;
      socket.timeout(5000).emit('newMessage', values, (err, response) => {
        if (err) {
          // console.log('err send message', err);
        } else {
          // console.log('success send message', response);
          actions.resetForm();
        }
      })
      actions.setSubmitting(false);
    },
  });

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>{t('chatPage.channels')}</b>
            <Button type="button" variant="" className="p-0 text-primary btn-group-vertical" onClick={() => setShowAddChannel(true)}>
              <AddChannelIcon />
              <span className="visually-hidden">+</span>
            </Button>
            <ModalAddRename
              show={showAddChannel}
              closeFn={() => setShowAddChannel(false)}
              title={t('chatPage.addChannel')}
              actionSubmit={(nameChannel) => (
                new Promise((resolve, reject) => {
                  socket.emit('newChannel', { name: nameChannel }, (response) => {
                    if (response.status === 'ok') {
                      setShowAddChannel(false);
                      notifySuccess(t('chatPage.toasts.createChannel'));
                      dispatch(addOneChannel(response.data));
                      dispatch(setCurrentChannel(response.data.id));
                      resolve();
                    } else {
                      notifyError(t('chatPage.toasts.serverErr'));
                      reject();
                    }
                  });
                })
              )}
              nameChannel={''}
            />
          </div>
          <Nav id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
            {channels.ids.map((id) => {
              const channel = channels.entities[id];
              const classNamesActive = channel.id === channels.currentChannelId ? 'btn-secondary' : '';
              return (
                <Nav.Item className="w-100" key={id}>
                  <Dropdown as={ButtonGroup} className="d-flex mt-1">
                    <Button variant="" className={`w-100 rounded-0 text-start text-truncate ${classNamesActive}`} onClick={() => dispatch(setCurrentChannel(channel.id))}>
                      <span class="me-1">#</span>{channel.name}
                    </Button>
                    {channel.removable && (
                      <>
                        <Dropdown.Toggle aria-expanded="false" variant={''} className={`flex-grow-0 dropdown-toggle-split ${classNamesActive}`}>
                          <span className="visually-hidden">{t('chatPage.labelManage')}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => setRemoveChannelId(id)}>{t('chatPage.deleteDropdownBtn')}</Dropdown.Item>
                          <Dropdown.Item onClick={() => setRenameChannelId(id)}>{t('chatPage.renameDropdownBtn')}</Dropdown.Item>
                        </Dropdown.Menu>
                      </>
                    )}
                  </Dropdown>
                </Nav.Item>
              )
            })}
            <ModalAddRename
              show={Boolean(renameChannelId)}
              closeFn={() => setRenameChannelId(null)}
              title={t('chatPage.renameChannel')}
              actionSubmit={(nameChannel) => {
                // console.log(nameChannel);
                socket.emit('renameChannel', { id: renameChannelId, name: nameChannel }, (response) => {
                  if (response.status === 'ok') {
                    setRenameChannelId(null);
                    notifySuccess(t('chatPage.toasts.renameChannel'));
                   } else {
                    notifyError(t('chatPage.toasts.serverErr'));
                   }
                });
              }}
              nameChannel={renameChannelId ? channels.entities[renameChannelId].name : ''}
            />
            <ModalRemove
              show={Boolean(removeChannelId)}
              closeFn={() => setRemoveChannelId(null)}
              title={t('chatPage.removeChannel')}
              // id={channels.currentChannelId}
              actionSubmit={() => {
                socket.emit('removeChannel', { id: removeChannelId }, (response) => {
                  if (response.status === 'ok') {
                    setRemoveChannelId(null);
                    notifySuccess(t('chatPage.toasts.deleteChannel'));
                   } else {
                    notifyError(t('chatPage.toasts.serverErr'));
                   }
                });
              }}
            />
          </Nav>
        </Col>
        <Col className="p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b># {activeChannel ? activeChannel.name : 'general'}</b>
              </p>
              <span className="text-muted">{t('chatPage.messageCount.count', { count: countMessages })}</span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5 ">
              {messages.ids.map((id) => {
                const message = messages.entities[id];
                if (message.channelId === activeChannel.id) {
                  return (
                    <div className="text-break mb-2">
                      <b>{message.username}</b>: <span>{getCensoredMessage(message.message)}</span> 
                    </div>
                  );
                } else {
                  return null;
                } 
              })}
            </div>
            <div className="mt-auto px-5 py-3">
              <Form className="py-1 border rounded-2" onSubmit={formik.handleSubmit} noValidate>
                <InputGroup>
                  <Form.Control
                    name="message"
                    autoFocus={true}
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
  )
};

export default ChatPage;