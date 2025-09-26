
import { call, put, takeLatest, all } from "redux-saga/effects";
import axios from "axios";
import { apiroute } from "../config";
import { bannerAddSuccessfully, banneraddfail, sendbannerRequest } from "../slices/bannerSlice";

const apidata = (payload) => {
    return axios.post(apiroute, payload)
} 

function* createBannerSaga(action) {
    try {
        console.log("payload", action.payload.formData);
        const response = yield call(apidata, action.payload.formData);

        yield put(bannerAddSuccessfully(response?.data));
    } catch (error) {
        yield put(banneraddfail(error?.message));
    }
}

export default function* bannerSaga() {
    yield takeLatest(sendbannerRequest.type, createBannerSaga)
}



