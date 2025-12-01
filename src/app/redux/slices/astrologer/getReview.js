// store/chatSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  review: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
 
};


const getReview = createSlice({
  name: 'reviewhistory',
  initialState,
  reducers: {
    fetchReview: (state) => {
      state.loading = true
    },
    fetchReviewSuccess: (state, action) => {
      state.loading = false
    const { data, currentPage, totalPages } = action.payload;
      state.review =  currentPage === 1 ? data : [...state.review, ...data];
     state.currentPage = currentPage;
      state.totalPages = totalPages;
    },
    fetchReviewFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    }
}
    

})

export const {
  fetchReview,
  fetchReviewSuccess,
  fetchReviewFailure,

} = getReview.actions

export default getReview.reducer
