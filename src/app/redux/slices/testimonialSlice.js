import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  testimonials: [],
  error: null,
};

const testimonialSlice = createSlice({
  name: "testimonial",
  initialState,
  reducers: {
    addTestimonialRequest: (state, action) => { state.loading = true; state.error = null; },
    addTestimonialSuccess: (state, action) => { state.loading = false; state.testimonials.push(action.payload); },
    addTestimonialFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    fetchTestimonialsRequest: (state) => { state.loading = true; state.error = null; },
    fetchTestimonialsSuccess: (state, action) => { state.loading = false; state.testimonials = action.payload; },
    fetchTestimonialsFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    updateTestimonialRequest: (state, action) => { state.loading = true; state.error = null; },
    updateTestimonialSuccess: (state, action) => {
      state.loading = false;
      const index = state.testimonials.findIndex(t => t.id === action.payload.id);
      if (index !== -1) state.testimonials[index] = action.payload;
    },
    updateTestimonialFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    deleteTestimonialRequest: (state, action) => { state.loading = true; state.error = null; },
    deleteTestimonialSuccess: (state, action) => {
      state.loading = false;
      state.testimonials = state.testimonials.filter(t => t.id !== action.payload);
    },
    deleteTestimonialFailure: (state, action) => { state.loading = false; state.error = action.payload; },
  },
});

export const {
  addTestimonialRequest, addTestimonialSuccess, addTestimonialFailure,
  fetchTestimonialsRequest, fetchTestimonialsSuccess, fetchTestimonialsFailure,
  updateTestimonialRequest, updateTestimonialSuccess, updateTestimonialFailure,
  deleteTestimonialRequest, deleteTestimonialSuccess, deleteTestimonialFailure,
} = testimonialSlice.actions;

export default testimonialSlice.reducer;
