
import { call, put, takeLatest } from 'redux-saga/effects'


import { fetchMessages, fetchMessagesSuccess, fetchMessagesFailure } from '../../slices/chathistory/chatHistorySlice';
import { apiroute, AuthHeader } from '../../config';
import axios from 'axios';








const apidata = (page = 1, limit = 10, astrologer_id) => {
  const token = AuthHeader();
const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.get(`${apiroute.CHAT_HISTORY}?page=${page}&limit=${limit}`, {
    headers,
    params: { astrologer_id }
  });



};



function* fetchChatMessages(action) {

  try {
 
    const { page = 1, limit = 10, astrologer_id } = action.payload || {};
    const res = yield call(apidata, page, limit, astrologer_id);







    yield put(
      fetchMessagesSuccess({
        data: res.data.chatData,
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
      })
    );
  } catch (error) {
    console.log("error", error?.message);
    yield put(fetchMessagesFailure(error.message))
  }
}





export default function* chatHistorySaga() {
  yield takeLatest(fetchMessages.type, fetchChatMessages);
}
