import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState({ ids: [], entities: {}, currentChannelId: 1 });

const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addOneChannel: channelsAdapter.addOne,
    addManyChannels: channelsAdapter.addMany,
    setCurrentChannel: (state, action) => {
      console.log('action curr id', action);
      state.currentChannelId = action.payload;
    },
    removeChannel: channelsAdapter.removeOne,
    renameChannel: channelsAdapter.updateOne,
  },
});

export const { addOneChannel, addManyChannels, removeChannel, renameChannel, setCurrentChannel } = channelSlice.actions;

export default channelSlice.reducer;
