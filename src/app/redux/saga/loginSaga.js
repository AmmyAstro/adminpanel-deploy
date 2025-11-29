import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import Cookies from "js-cookie";   



import { loginRequest, loginSuccess, loginFailure } from "../slices/loginSlice";
import { apiroute } from "../config";



const loginapi = (payload) =>{
  return  axios.post(apiroute.AdminLogin,payload)

}

function* loginUser(action) {

  try {
    const response = yield call(loginapi,action.payload);  

    const data = response.data;

    console.log("ASaS",data);
  
yield put(loginSuccess({
        user: data.staffid,
        token: data?.token,
      })
    );

  } catch (err) {
    yield put(loginFailure(
      "res", err.response?.data?.error || err.message));
  }
}

export default function* loginSaga() {
  yield takeLatest(loginRequest.type, loginUser);
}
