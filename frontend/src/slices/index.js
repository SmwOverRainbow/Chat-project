import { configureStore } from '@reduxjs/toolkit';
import channelReducer from './channelsSlice.js';
import messageReducer from './messagesSlice.js';
import modalReducer from './modalSlice.js';

export default configureStore({
  reducer: {
    channels: channelReducer,
    messages: messageReducer,
    modal: modalReducer,
  },
});
