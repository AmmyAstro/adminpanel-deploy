
import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  transactions: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
    balance: 0,
};

const WalletSlice = createSlice({
  name: 'astrologerWallet',
  initialState,
  reducers: {
    fetchWalletRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchWalletSuccess(state, action) {
    const {data,totalPages,currentPage}= action.payload;
      state.loading = false;
      state.balance = action.payload.balance;

      state.transactions = currentPage === 1 ? data :  [...state.transactions,...data];

      state.totalPages = totalPages;
      state.currentPage= currentPage;
    },
    fetchWalletFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    withdrawRequest(state, action) {
      state.loading = true;
    },
    depositRequest(state, action) {
      state.loading = true;
    },
  },
});

export const {
  fetchWalletRequest,
  fetchWalletSuccess,
  fetchWalletFailure,
  withdrawRequest,
  depositRequest,
} = WalletSlice.actions;

export default WalletSlice.reducer;
