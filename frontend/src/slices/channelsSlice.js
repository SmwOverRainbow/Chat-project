/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState({
  ids: [],
  entities: {},
  currentChannelId: 1,
});

const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addOneChannel: channelsAdapter.addOne,
    addManyChannels: channelsAdapter.addMany,
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload;
    },
    removeChannel: (state, action) => {
      channelsAdapter.removeOne(state, action);
      if (action.payload.id === state.currentChannelId) {
        state.currentChannelId = 1;
      }
    },
    renameChannel: channelsAdapter.updateOne,
  },
});

export const {
  addOneChannel, addManyChannels, removeChannel, renameChannel, setCurrentChannelId,
} = channelSlice.actions;

export default channelSlice.reducer;
