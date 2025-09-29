import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import Cookies from "js-cookie";   



import { loginRequest, loginSuccess, loginFailure } from "../slices/loginSlice";
import { apiroute } from "../config";

function* loginUser(action) {

  console.log("XAAx",action.payload);
  try {
    const response = yield call(axios.post,apiroute.AdminLogin, action.payload);  

    const data = response.data;
  
yield put(loginSuccess({
        user: data.user,
        token: data.accessToken,
      })
    );

  } catch (err) {
    yield put(loginFailure(err.response?.data?.error || err.message));
  }
}

export default function* loginSaga() {
  yield takeLatest(loginRequest.type, loginUser);
}
