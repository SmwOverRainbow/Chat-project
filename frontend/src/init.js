import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './locales/ru.js';
import store from './slices/index.js';
import {
  addOneChannel, removeChannel, renameChannel, setCurrentChannelId,
} from './slices/channelsSlice.js';
import { addOneMessage } from './slices/messagesSlice.js';

const init = async (socket) => {
  const { dispatch } = store;

  socket.on('newMessage', (message) => dispatch(addOneMessage(message)));
  socket.on('newChannel', (channel) => {
    dispatch(addOneChannel(channel));
  });
  socket.on('removeChannel', ({ id }) => {
    dispatch(removeChannel(id));
    const state = store.getState();
    if (id === state.channels.currentChannelId) {
      dispatch(setCurrentChannelId(1));
    }
  });
  socket.on('renameChannel', (channel) => dispatch(renameChannel({ id: channel.id, changes: { name: channel.name } })));

  const i18nextInstance = i18n.createInstance();
  await i18nextInstance
    .use(initReactI18next)
    .init({
      lng: 'ru',
      debug: true,
      resources,
    });
};

export default init;
