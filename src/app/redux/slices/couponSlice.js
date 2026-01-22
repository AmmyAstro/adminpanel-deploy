import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  add: {
    loading: false,
    success: false,
    error: null,
  },
  list: {
    loading: false,
    data: [],
    error: null,
  },
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    // Fetch all
    fetchCouponsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCouponsSuccess: (state, action) => {
      state.loading = false;
      state.coupons = action.payload;

    },
    fetchCouponsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;

    },

    // Get by ID
    fetchCouponByIdRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCouponByIdSuccess: (state, action) => {
      state.loading = false;
      state.currentCoupon = action.payload;
    },
    fetchCouponByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create
    createCouponRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createCouponSuccess: (state, action) => {
      state.loading = false;
      // state.coupons.push(action.payload);
      state.addCode = 200;
    },
    createCouponFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update
    updateCouponRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCouponSuccess: (state, action) => {
      state.loading = false;
      const index = state.coupons.findIndex(c => c.id === action.payload.id);
      if (index !== -1) state.coupons[index] = action.payload;
    },
    updateCouponFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete
    deleteCouponRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteCouponSuccess: (state, action) => {
      state.loading = false;
      state.coupons = state.coupons.filter(c => c.id !== action.payload);
    },
    deleteCouponFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetCode: (state, action) => {
      state.resetCode = null;
    }
  },
});

export const {
  fetchCouponsRequest,
  fetchCouponsSuccess,
  fetchCouponsFailure,
  fetchCouponByIdRequest,
  fetchCouponByIdSuccess,
  fetchCouponByIdFailure,
  createCouponRequest,
  createCouponSuccess,
  createCouponFailure,
  updateCouponRequest,
  updateCouponSuccess,
  updateCouponFailure,
  deleteCouponRequest,
  deleteCouponSuccess,
  deleteCouponFailure,
  resetCode
} = couponSlice.actions;

export default couponSlice.reducer;
