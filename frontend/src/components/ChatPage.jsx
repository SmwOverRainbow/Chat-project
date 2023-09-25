import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { Container, Row, Col, /* Dropdown, ButtonGroup */ } from 'react-bootstrap';
import { initSocket } from '../socket.js';
import {
  addManyChannel, addOneChannel, removeChannel, renameChannel, setCurrentChannel
  } from '../slices/channelsSlice.js';
import { addManyMessage, addMessage } from '../slices/messagesSlice.js';
// import DropdownMenu from 'react-bootstrap/esm/DropdownMenu.js';
// import DropdownItem from 'react-bootstrap/esm/DropdownItem.js';
// import { setCurrentChannel } from '../slices/currentChannelSlice.js';

let socket;

const ChatPage = () => {
// const location = useLocation();
  const navigate = useNavigate();
  const getData = async (token) => {
    // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const responce = await axios.get('/api/v1/data', { headers: { 'Authorization': `Bearer ${token}` }});
      // console.log('responce', responce);
      return responce.data;
    } catch (e) {
      console.error(e);
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      socket = socket || initSocket();
      socket.on('newMessage', (message) => dispatch(addMessage(message)));
      socket.on('newChannel', (channel) => dispatch(addOneChannel(channel)));
      socket.on('removeChannel', (channel) => dispatch(removeChannel(channel)));
      socket.on('renameChannel', (channel) => dispatch(renameChannel(channel)));
      getData(token)
        .then((data) => {
          console.log(data.currentChannelId);
          dispatch(addManyChannel(data.channels));
          dispatch(addManyMessage(data.messages));
        })
    } else {
      navigate('login', { replace: false });
    }
  }, [navigate, dispatch]);

  const channels = useSelector((state) => {
    console.log('state', state);
    return state.channels;
  });
  const messages = useSelector((state) => state.messages);
  console.log('messages', messages);

  const activeChannel = channels.entities[channels.currentChannelId];
  // console.log('activeChannel', activeChannel);
  // console.log('name channel', activeChannel.name);

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>Каналы</b>
            <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={() => {/* MODAL Window*/}}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              <span className="visually-hidden">+</span>
            </button>
          </div>
          <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
            {channels.ids.map((id) => {
              const channel = channels.entities[id];
              const classNamesActive = channel.id === channels.currentChannelId ? 'btn-secondary' : '';
              return (<li class="nav-item w-100">
              <button type="button" className={`w-100 rounded-0 text-start btn ${classNamesActive}`} onClick={() => dispatch(setCurrentChannel(channel.id))}>
                <span class="me-1">#</span>{channel.name}
              </button>
              {channel.removable && (
              <>
                <button type="button" id="react-aria5100748750-1" aria-expanded="false" className={`flex-grow-0 dropdown-toggle dropdown-toggle-split btn ${classNamesActive}`}>
                  <span class="visually-hidden">Управление каналом</span>
                </button>
                <div x-placement="bottom-end" aria-labelledby="react-aria5100748750-1" className="dropdown-menu show" data-popper-reference-hidden="false" data-popper-escaped="false" data-popper-placement="bottom-end" /* style="position: absolute; inset: 0px 0px auto auto; transform: translate3d(0px, 40px, 0px);" */ >
                  <a data-rr-ui-dropdown-item="" class="dropdown-item" role="button" tabindex="0" href="/">Удалить</a>
                  <a data-rr-ui-dropdown-item="" class="dropdown-item" role="button" tabindex="0" href="/">Переименовать</a>
                </div>
                {
                  // <Dropdown as={ButtonGroup} className="d-flex mt-1">
                  //   <button type="button" className={`w-100 rounded-0 text-start btn ${classNamesActive}`} onClick={() => dispatch(setCurrentChannel(channel.id))}>
                  //     <span class="me-1">#</span>{channel.name}
                  //   </button>
                  //   <Dropdown.Toggle aria-expanded="false" className={`flex-grow-0 dropdown-toggle dropdown-toggle-split ${classNamesActive}`}>
                  //     <span class="visually-hidden">Управление каналом</span>
                  //   </Dropdown.Toggle>
                  //   <Dropdown.Menu>
                  //     <Dropdown.Item onClick={() => {/* MODAL Window*/}}>Удалить</Dropdown.Item>
                  //     <Dropdown.Item onClick={() => {/* MODAL Window*/}}>Переименовать</Dropdown.Item>
                  //   </Dropdown.Menu>
                  // </Dropdown>
                }
              </>
              )}
              </li>)
              })} 
            </ul>
        </Col>
        <Col className="p-0 h-100">
          <div class="d-flex flex-column h-100">
            <div class="bg-light mb-4 p-3 shadow-sm small">
              <p class="m-0">
                <b># {activeChannel ? activeChannel.name : 'general'}</b>
              </p>
              <span class="text-muted">сообщения</span>
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
                  values.channelId = activeChannel.id || 1;
                  socket.timeout(5000).emit('newMessage', values, (err, response) => {
                    if (err) {
                      // console.log('err send message', err);
                    } else {
                      console.log('success send message', response);
                      actions.resetForm({
                        values: {
                          message: '',
                        }
                      })
                    }
                  });
                  actions.setSubmitting(false);
                }}
                >
                {() => (
                <Form className="col-12 col-md-12 mt-3 mt-mb-0">
                  <div className="input-group border-0 p-0 ps-2">
                    <Field name="message" aria-label="Новое сообщение" autoFocus={true} placeholder="Введите сообщение..." className="form-control" required />
                    <button type="submit" class="btn" disabled="">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
                      </svg>
                      <span class="visually-hidden">Отправить</span>
                    </button>
                  </div>
                </Form>)}
              </Formik>
              {/* <form novalidate class="py-1 border rounded-2">
                <div class="input-group has-validation">
                  <input type="text" name="body" aria-label="Новое сообщение" placeholder="Введите сообщение..." class="border-0 p-0 ps-2 form-control" value="" />
                  <button type="submit" class="btn btn-group-vertical" disabled="">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                      <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
                    </svg>
                    <span class="visually-hidden">Отправить</span>
                  </button>
                </div>
              </form> */}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
};

export default ChatPage;