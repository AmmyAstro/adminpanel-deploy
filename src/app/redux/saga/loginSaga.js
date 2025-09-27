import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import Cookies from "js-cookie";   


import { loginRequest, loginSuccess, loginFailure } from "../slices/loginSlice";

function* loginUser(action) {
  try {
    const response = yield call(axios.post, "http://localhost:5000/api/login", action.payload);

    const data = response.data;

    localStorage.setItem("accessToken", data.accessToken);
    Cookies.set("accessToken", data.accessToken, { expires: 1 }); 

    yield put(
      loginSuccess({
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
