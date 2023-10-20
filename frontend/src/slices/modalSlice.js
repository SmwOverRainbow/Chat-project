import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  show: false,
  type: null,
  data: {},
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showWindow: (state, action) => {
      state.show = true;
      state.type = action.payload.type;
      state.data = action.payload.data || {};
    },
    closeWindow: (state) => {
      state.show = false;
      state.type = null;
      state.data = {};
    },
  },
});

export const { showWindow, closeWindow } = modalSlice.actions;
export default modalSlice.reducer;
