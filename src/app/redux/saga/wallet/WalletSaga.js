// features/astrologerWallet/astrologerWalletSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { apiroute, AuthHeader } from '../../config';
import { fetchWalletRequest,fetchWalletSuccess,fetchWalletFailure } from '../../slices/wallet/WalletSlice';



const wallet =  (astrologer_id,limit,page) =>{
    const token = AuthHeader(); 
    const headers = {
  Authorization: `Bearer ${token}`
    };
 return axios.get(`${apiroute.WALLET_HISTORY}?page=${page}&limit=${limit}`, {
    headers,
    params: { astrologer_id }
  });


}


function* fetchWalletSaga(action) {
  try {
      const { page = 1, limit = 10, astrologer_id } = action.payload || {};
    const response = yield call(wallet,astrologer_id,limit,page);



    yield put(fetchWalletSuccess({
        data:response?.data?.wallet,
        totalPages:response?.data?.totalPages,
        currentPage:response?.data?.currentPage
 }));
  } catch (error) {


    yield put(fetchWalletFailure(error.toString()));
  }
}

// Watcher saga
export default function* WalletSaga() {
  yield takeLatest(fetchWalletRequest.type, fetchWalletSaga);
}
