import { configureStore } from '@reduxjs/toolkit';
import channelReducer from './channelsSlice.js';
import messageReducer from './messagesSlice.js';
// import currentChannelReducer from './currentChannelSlice.js';

export default configureStore({
  reducer: {
    channels: channelReducer,
    messages: messageReducer,
    // currentChannelId: currentChannelReducer,
    // users: userReducer,
  },
});
