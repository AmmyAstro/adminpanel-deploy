import { takeLatest, all, put, call } from "redux-saga/effects";
import axios from "axios";
import { apiroute } from "../config";
import { packageAddSuccessfully, packageaddfail, sendpackageRequest } from "../slices/packageSlice";

const apidata = (payload) => {
    return axios.post(apiroute.packageAdd, payload)
}

// create package
function* packageAddSaga(action) {
    try {
        const response = yield call(apidata, action.payload);
        yield put(packageAddSuccessfully(response.data.package));
    } catch (error) {
        console.error("Package add error:", error);
        yield put(packageaddfail(error.message));
    }
}
export default function* packageSaga() {
    yield all([
        takeLatest(sendpackageRequest.type, packageAddSaga),
    ]);
}