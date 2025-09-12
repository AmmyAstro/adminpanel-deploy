// redux/sagas/loginSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import { loginRequest, loginSuccess, loginFailure } from "../slices/loginSlice";

function* loginUser(action) {
  try {
    const response = yield call(fetch, "http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action.payload),
    });

    const data = yield response.json();


    console.log("Login Response:", data);
 
    localStorage.setItem("accessToken", data.accessToken);

    yield put(
      loginSuccess({
        user: data.user,
        token: data.accessToken,
      })
    );
  } catch (err) {
    yield put(loginFailure(err.message));
  }
}

export default function* loginSaga() {
  yield takeLatest(loginRequest.type, loginUser);
}
