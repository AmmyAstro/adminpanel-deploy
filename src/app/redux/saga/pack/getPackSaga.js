import { call, put, takeLatest } from "redux-saga/effects";
import { sendRequestPackage, sendRequestPackageSuccess, sendRequestPackageFail, 
  updatePackStatus, sendRequestUpdatePackageStatus } from "../../slices/pack/getPackSlice";
import axios from "axios";
import { apiroute, AuthHeader } from "../../config";



const fetchPackageApi = () => {
  return axios.get(apiroute.FETCH_PACKAGE);
};
const fetchPackStatusApi = (payload) => {
  const token = AuthHeader();
  const headers = {
    Authorization: `Bearer ${token}`
  };
  console.log("Headers for Pack Status Update:", headers);
  return axios.post(apiroute.PACK_STATUS_UPDATE, payload, { headers })
}


function* handleSendRequestPackage() {
  try {
    const data = yield call(fetchPackageApi);
    yield put(sendRequestPackageSuccess(data?.data));
  } catch (err) {
    yield put(sendRequestPackageFail(err.message));
  }
}

function* updatePackStatusSaga(action) {
  try {
    console.log("Update Pack Status Payload:", action.payload);
    const data = yield call(fetchPackStatusApi, action.payload);
    console.log("Update Pack Status Response:", data);
    yield put(updatePackStatus(data?.data));
  } catch (err) {
    console.error("Update Pack Status Error:", err.message);
  }
}

export default function* getPackSaga() {
  yield takeLatest(sendRequestPackage.type, handleSendRequestPackage);
  yield takeLatest(sendRequestUpdatePackageStatus.type, updatePackStatusSaga);
}
