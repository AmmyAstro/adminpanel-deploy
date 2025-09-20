import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  response: [],
};

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    sendbannerRequest: (state, action) => {
      state.loading = true;
    },
    bannerAddSuccessfully: (state, action) => {
      state.loading = false;
      state.response = action.payload;
    },
    banneraddfail: (state, action) => {
      state.loading = false;
      state.response = action.payload;
    },
  },
});

export const { sendbannerRequest, bannerAddSuccessfully, banneraddfail } =
  bannerSlice.actions;

export default bannerSlice.reducer;
