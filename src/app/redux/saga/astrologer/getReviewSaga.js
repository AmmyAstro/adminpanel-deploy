
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import axios from 'axios'
import { fetchReview, fetchReviewSuccess, fetchReviewFailure } from '../../slices/astrologer/getReview';
import { apiroute, AuthHeader } from '../../config';




const apidata = (page = 1, limit = 10, astro_id) => {


  const token = AuthHeader();
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.get(`${apiroute.ASTROLOGER_REVIEW}?page=${page}&limit=${limit}`, {
    headers,
    params: { astro_id }
  });



};




function* fetchChatMessages(action) {

  try {

    const { page = 1, limit = 10, astro_id } = action.payload || {};
    const res = yield call(apidata, page, limit, astro_id);
  

    yield put(
      fetchReviewSuccess({
        data: res.data.reviewdata,
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
      })
    );
  } catch (error) {
    console.log("error", error?.message);
    yield put(fetchReviewFailure(error.message))
  }
}









export default function* getReviewSaga() {
  yield takeLatest(fetchReview.type, fetchChatMessages);


}
