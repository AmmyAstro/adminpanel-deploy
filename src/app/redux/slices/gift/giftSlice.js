
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gifts: [],
  loading: false,
  error: null,
};

const giftSlice = createSlice({
  name: 'gift',
  initialState,
  reducers: {
    fetchGiftsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchGiftsSuccess(state, action) {
      state.loading = false;
      state.gifts = action.payload;
    },
    fetchGiftsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchGiftsRequest, fetchGiftsSuccess, fetchGiftsFailure } = giftSlice.actions;
export default giftSlice.reducer;
