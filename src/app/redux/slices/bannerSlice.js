import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addBanner: {
    loading: false,
    success: false,
    error: null,
  },
  listBanner: {
    loading: false,
    data: [],
    error: null,
  },
};

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    // Add Banner 
    addbannerRequest: (state, action) => {
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

    // Fetch banner list
    fetchBannerRequest: (state) => {
      state.listBanner.loading = true;
    },
    fetchBannerSuccess: (state, action) => {
      state.listBanner.loading = false;
      state.listBanner.data = action.payload.bannerList;
    },
    fetchBannerFail: (state, action) => {
      state.listBanner.loading = false;
      state.listBanner.error = action.payload;
    },
  },
});

export const { addbannerRequest, bannerAddSuccessfully, banneraddfail, fetchBannerRequest, fetchBannerSuccess, fetchBannerFail } = bannerSlice.actions;

export default bannerSlice.reducer;
