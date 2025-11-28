
import { call, put, takeLatest } from 'redux-saga/effects';

import axios from 'axios';

import { apiroute, AuthHeader } from '../../config';
import { fetchGiftsRequest,fetchGiftsSuccess,fetchGiftsFailure } from '../../slices/gift/giftSlice';




const fetchGiftsApi = (astro_id) => {


    const token = AuthHeader(); 
  const headers = {
        Authorization: `Bearer ${token}`
    };
  return axios.get(apiroute.GET_HISTORY,{
        headers,
        params:{astro_id}
    })


}

function* fetchGifts(action) {
  try {
    const {astro_id}= action.payload;
    const gifts = yield call(fetchGiftsApi,astro_id);
    yield put(fetchGiftsSuccess(gifts?.data?.giftdata));
  } catch (error) {
 
    yield put(fetchGiftsFailure(error.message));
  }
}


export default function* giftSaga() {
  yield takeLatest(fetchGiftsRequest.type, fetchGifts);
}
