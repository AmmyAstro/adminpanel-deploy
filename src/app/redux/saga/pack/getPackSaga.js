import { call, put, takeLatest } from "redux-saga/effects";
import { sendRequestPackage,sendRequestPackageSuccess,sendRequestPackageFail } from "../../slices/pack/getPackSlice";
import axios from "axios";
import { apiroute } from "../../config";



const fetchPackageApi = () => {
    return axios.get(apiroute.FETCH_PACKAGE);
};


function* handleSendRequestPackage() {
  try {
    const data = yield call(fetchPackageApi);
    yield put(sendRequestPackageSuccess(data?.data));  
  } catch (err) {
    yield put(sendRequestPackageFail(err.message));
  }
}

export default function* getPackSaga() {
  yield takeLatest(sendRequestPackage.type, handleSendRequestPackage);
}
