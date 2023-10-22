import React, { useContext, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { SocketEmitContext } from '../context/socketEmitContext.js';
import { AuthContext } from '../context/authContext.js';
import { notifyError } from '../utils/toasts.js';
import { getCensoredMessage } from '../utils/helpers.js';
import { ReactComponent as AddMessageIcon } from '../images/addMessage.svg';

const ChatBody = () => {
  const { t } = useTranslation();
  const clarify = useContext(SocketEmitContext);
  const { username } = useContext(AuthContext);
  const inputRef = useRef();
  const messagesContainerRef = useRef();
  const channels = useSelector((state) => state.channels);
  const messages = useSelector((state) => state.messages);

  useEffect(() => {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  }, [messages.ids.length, channels.currentChannelId]);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    });
  }, [channels.currentChannelId]);

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
          notifyError(t('toasts.serverErr'));
        })
        .finally(() => actions.setSubmitting(false));
    },
  });

  const activeChannel = channels.entities[channels.currentChannelId];
  const countMessages = messages.ids.reduce((acc, id) => {
    if (messages.entities[id].channelId === channels.currentChannelId) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <div className="d-flex flex-column h-100">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b>
            <span># </span>
            {activeChannel ? activeChannel.name : 'general'}
          </b>
        </p>
        <span className="text-muted">{t('chatBody.messageCount.count', { count: countMessages })}</span>
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
              name="message"
              ref={inputRef}
              className="border-0 p-0 ps-2 rounded-2"
              type="text"
              placeholder={t('chatBody.messagePlaceholder')}
              aria-label={t('chatBody.messageLabel')}
              onChange={formik.handleChange}
              value={formik.values.message}
              required
            />
            <Button type="submit" className="btn-group-vertical" variant="" disabled="">
              <AddMessageIcon />
              <span className="visually-hidden">{t('chatBody.btnSubmit')}</span>
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
};

export default ChatBody;
