import { configureStore } from '@reduxjs/toolkit';
import channelReducer from './channelsSlice.js';
import messageReducer from './messagesSlice.js';

export default configureStore({
  reducer: {
    channels: channelReducer,
    messages: messageReducer,
  },
});
