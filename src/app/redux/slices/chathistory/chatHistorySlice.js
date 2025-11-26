// store/chatSlice.js
import { createSlice } from '@reduxjs/toolkit'




const initialState = {
  messages: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};


const chatHistorySlice = createSlice({
  name: 'chathistory',
  initialState,
  reducers: {
    fetchMessages: (state) => {
      state.loading = true
    },
    fetchMessagesSuccess: (state, action) => {
      state.loading = false
    const { data, currentPage, totalPages } = action.payload;
      state.messages =  currentPage === 1 ? data : [...state.messages, ...data];
     state.currentPage = currentPage;
      state.totalPages = totalPages;
    },
    fetchMessagesFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
   
  },
})

export const {
  fetchMessages,
  fetchMessagesSuccess,
  fetchMessagesFailure,

} = chatHistorySlice.actions

export default chatHistorySlice.reducer
