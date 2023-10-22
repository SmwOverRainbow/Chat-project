/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  show: false,
  type: null,
  channelId: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showWindow: (state, action) => {
      state.show = true;
      state.type = action.payload.type;
      state.channelId = action.payload.channelId || null;
    },
    closeWindow: (state) => {
      state.show = false;
      state.type = null;
      state.channelId = null;
    },
  },
});

export const { showWindow, closeWindow } = modalSlice.actions;
export default modalSlice.reducer;
