import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addManyMessage: messagesAdapter.addMany,
  },
});

export const { addMessage, addManyMessage } = messageSlice.actions;
export default messageSlice.reducer;
