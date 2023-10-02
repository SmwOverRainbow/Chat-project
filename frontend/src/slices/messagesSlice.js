import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { removeChannel } from './channelsSlice.js';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addOneMessage: messagesAdapter.addOne,
    addManyMessages: messagesAdapter.addMany,
    // removeMessages: messagesAdapter.removeMany,
  },
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, action) => {
      const removeChannelId = action.payload;
      console.log(action.payload);
      const messagesIdsForRemove = state.ids.filter((id) => (
        state.entities[id].channelId === removeChannelId
      ));
      messagesAdapter.removeMany(state, messagesIdsForRemove);
    })
  },
});

export const { addOneMessage, addManyMessages } = messageSlice.actions;
export default messageSlice.reducer;
