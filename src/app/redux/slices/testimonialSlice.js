import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  testimonials: [],
  currentTestimonial: null,
  loading: false,
  error: null,
};

const testimonialSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {
    fetchTestimonialRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTestimonialSuccess: (state, action) => {
      state.loading = false;
      state.currentTestimonial = action.payload; // <--- important!
      state.error = null;
    },
    fetchTestimonialFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchTestimonialsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTestimonialsSuccess: (state, action) => {
      state.loading = false;
      state.testimonials = action.payload;
      state.error = null;
    },
    fetchTestimonialsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    addTestimonialRequest: (state) => { state.loading = true; state.error = null },
    addTestimonialSuccess: (state, action) => {
      state.loading = false;
      state.testimonials.push(action.payload);
      state.error = null;
    },
    addTestimonialFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateTestimonialRequest: (state) => { state.loading = true; state.error = null },
    updateTestimonialSuccess: (state, action) => {
      state.loading = false;
      const index = state.testimonials.findIndex(t => t.id === action.payload.id);
      if(index !== -1) state.testimonials[index] = action.payload;
      if(state.currentTestimonial?.id === action.payload.id) {
        state.currentTestimonial = action.payload; // update current
      }
      state.error = null;
    },
    updateTestimonialFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteTestimonialRequest: (state) => { state.loading = true; state.error = null },
    deleteTestimonialSuccess: (state, action) => {
      state.loading = false;
      state.testimonials = state.testimonials.filter(t => t.id !== action.payload);
      state.error = null;
    },
    deleteTestimonialFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchTestimonialRequest,
  fetchTestimonialSuccess,
  fetchTestimonialFailure,
  fetchTestimonialsRequest,
  fetchTestimonialsSuccess,
  fetchTestimonialsFailure,
  addTestimonialRequest,
  addTestimonialSuccess,
  addTestimonialFailure,
  updateTestimonialRequest,
  updateTestimonialSuccess,
  updateTestimonialFailure,
  deleteTestimonialRequest,
  deleteTestimonialSuccess,
  deleteTestimonialFailure,
} = testimonialSlice.actions;

export default testimonialSlice.reducer;
