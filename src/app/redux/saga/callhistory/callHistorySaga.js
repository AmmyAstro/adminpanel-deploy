import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";

import { fetchcallHistory, fetchCallSuccess, fetchcallFailure } from "../../slices/callhistory/getCallHistory";
import { apiroute, AuthHeader } from "../../config";





const apidata = (page = 1, limit = 10, astrologer_id) => {
  const token = AuthHeader();
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.get(`${apiroute.CALL_HISTORY}?page=${page}&limit=${limit}`, {
    headers,
    params: { astrologer_id }
  });
};

function* fetchCallData(action) {
  try {

    const { page = 1, limit = 10, astrologer_id } = action.payload || {};
    const res = yield call(apidata, page, limit, astrologer_id);
    yield put(
      fetchCallSuccess({
        data: res.data.call_Data,
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
      })
    );
  } catch (error) {
    yield put(fetchcallFailure(error.message));
  }
}

export default function* callHistorySaga() {
  yield takeLatest(fetchcallHistory.type, fetchCallData);
}
