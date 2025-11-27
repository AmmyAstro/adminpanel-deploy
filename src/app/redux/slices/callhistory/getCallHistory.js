// store/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  calldata: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

const getCallHistory = createSlice({
  name: "callhistory",
  initialState,
  reducers: {
    fetchcallHistory: (state) => {
      state.loading = true;
    },
    fetchCallSuccess: (state, action) => {
      state.loading = false;

      const { data, currentPage, totalPages } = action.payload;


      state.calldata =  currentPage === 1 ? data : [...state.calldata, ...data];

      state.currentPage = currentPage;
      state.totalPages = totalPages;
    },
    fetchcallFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetCallHistory: (state) => {
      state.calldata = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.error = null;
    },
  },
});

export const {
  fetchcallHistory,
  fetchCallSuccess,
  fetchcallFailure,
  resetCallHistory,
} = getCallHistory.actions;

export default getCallHistory.reducer;
