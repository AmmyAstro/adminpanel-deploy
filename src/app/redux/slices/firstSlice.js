import { createSlice } from "@reduxjs/toolkit";

const astroSlice = createSlice({
  name: "astro",
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    fetchAstroRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAstroSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchAstroFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchAstroRequest, fetchAstroSuccess, fetchAstroFailure } =
  astroSlice.actions;
export default astroSlice.reducer;
