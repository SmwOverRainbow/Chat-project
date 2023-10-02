import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { Container, Row, Col, Dropdown, ButtonGroup, Nav, Button } from 'react-bootstrap';
import ModalAddRename from './ModalAddRename.jsx';
import { initSocket } from '../socket.js';
import {
  addManyChannels, addOneChannel, removeChannel, renameChannel, setCurrentChannel
  } from '../slices/channelsSlice.js';
import { addManyMessages, addOneMessage } from '../slices/messagesSlice.js';
import ModalRemove from './ModalRemove.jsx';

let socket;

const ChatPage = () => {
// const location = useLocation();
  const navigate = useNavigate();
  const getData = async (token) => {
    // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const response = await axios.get('/api/v1/data', { headers: { 'Authorization': `Bearer ${token}` }});
      // console.log('response', response);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  };

  const dispatch = useDispatch();

  const channels = useSelector((state) => {
    console.log('state', state);
    return state.channels;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
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
      getData(token)
        .then((data) => {
          // console.log(data.currentChannelId);
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
  // console.log('activeChannel', activeChannel);
  // console.log('name channel', activeChannel.name);

  const [showAddChannel, setShowAddChannel] = useState(false);
  const [renameChannelId, setRenameChannelId] = useState(null);
  const [removeChannelId, setRemoveChannelId] = useState(null);

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>Каналы</b>
            <Button type="button" variant="" className="p-0 text-primary btn-group-vertical" onClick={() => setShowAddChannel(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              <span className="visually-hidden">+</span>
            </Button>
            <ModalAddRename
              show={showAddChannel}
              closeFn={() => setShowAddChannel(false)}
              title={'Добавить канал'}
              actionSubmit={(nameChannel) => {
                // console.log(nameChannel);
                socket.emit('newChannel', { name: nameChannel }, (response) => {
                  if (response.status === 'ok') {
                    setShowAddChannel(false);
                    dispatch(setCurrentChannel(response.data.id));
                  } else {
                    alert('Error');
                  }
                });
              }}
              nameChannel={''}
            />
          </div>
          <Nav id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
            {channels.ids.map((id) => {
              const channel = channels.entities[id];
              const classNamesActive = channel.id === channels.currentChannelId ? 'btn-secondary' : '';
              return (
                <Nav.Item class="nav-item w-100" key={id}>
                  <Dropdown as={ButtonGroup} className="d-flex mt-1">
                    <Button variant="" className={`w-100 rounded-0 text-start text-truncate ${classNamesActive}`} onClick={() => dispatch(setCurrentChannel(channel.id))}>
                      <span class="me-1">#</span>{channel.name}
                    </Button>
                    {channel.removable && (
                      <>
                        <Dropdown.Toggle aria-expanded="false" variant={''} className={`flex-grow-0 dropdown-toggle-split ${classNamesActive}`}>
                          <span class="visually-hidden">Управление каналом</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => setRemoveChannelId(id)}>Удалить</Dropdown.Item>
                          <Dropdown.Item onClick={() => setRenameChannelId(id)}>Переименовать</Dropdown.Item>
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
              title={'Переименовать канал'}
              actionSubmit={(nameChannel) => {
                // console.log(nameChannel);
                socket.emit('renameChannel', { id: renameChannelId, name: nameChannel }, (response) => {
                  response.status === 'ok' ? setRenameChannelId(null) : alert('Error');
                });
              }}
              nameChannel={renameChannelId ? channels.entities[renameChannelId].name : ''}
            />
            <ModalRemove
              show={Boolean(removeChannelId)}
              closeFn={() => setRemoveChannelId(null)}
              title={'Удалить канал'}
              // id={channels.currentChannelId}
              actionSubmit={() => {
                socket.emit('removeChannel', { id: removeChannelId }, (response) => {
                  response.status === 'ok' ? setRemoveChannelId(null) : alert('Error');
                });
              }}
            />
          </Nav>
        </Col>
        <Col className="p-0 h-100">
          <div class="d-flex flex-column h-100">
            <div class="bg-light mb-4 p-3 shadow-sm small">
              <p class="m-0">
                <b># {activeChannel ? activeChannel.name : 'general'}</b>
              </p>
              <span class="text-muted"><span>{countMessages}</span> сообщения</span>
            </div>
            <div id="messages-box" class="chat-messages overflow-auto px-5 ">
              {messages.ids.map((id) => {
                const message = messages.entities[id];
                if (message.channelId === activeChannel.id) {
                  return (
                    <div class="text-break mb-2">
                      <b>admin</b>: <span>{message.message}</span>
                    </div>
                  );
                } else {
                  return null;
                } 
              })}
            </div>
            <div class="mt-auto px-5 py-3">
              <Formik
                initialValues={{ message: '', channelId: 1 }}
                onSubmit={ (values, actions) => {
                  values.channelId = channels.currentChannelId;
                  socket.timeout(5000).emit('newMessage', values, (err, response) => {
                    if (err) {
                      // console.log('err send message', err);
                    } else {
                      console.log('success send message', response);
                      actions.resetForm();
                    }
                  });
                  actions.setSubmitting(false);
                }}
                >
                {() => (
                <Form className="col-12 col-md-12 mt-3 mt-mb-0">
                  <div className="input-group border-0 p-0 ps-2">
                    <Field name="message" aria-label="Новое сообщение" autoFocus placeholder="Введите сообщение..." className="form-control" required />
                    <Button type="submit" variant="" className="btn" disabled="">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
                      </svg>
                      <span class="visually-hidden">Отправить</span>
                    </Button>
                  </div>
                </Form>)}
              </Formik>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
};

export default ChatPage;