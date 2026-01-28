
import { call, put, takeLatest, all } from "redux-saga/effects";
import axios from "axios";
import { apiroute } from "../config";
import { bannerAddSuccessfully, banneraddfail, addbannerRequest, fetchBannerFail, fetchBannerRequest, fetchBannerSuccess, deleteBannerSuccess, deleteBannerFail, deleteBannerRequest } from "../slices/bannerSlice";

const apidata = (payload) => {
    return axios.post(apiroute.bannerAdd, payload)
}
const bannerListFetch = () => {
    return axios.get(apiroute.bannerList)
}

const bannerDeleteApi = (id) => {
    return axios.delete(apiroute.bannerDelete(id));
}

// create banner 
function* createBannerSaga(action) {
    try {
        console.log("payload", action.payload.formData);
        const response = yield call(apidata, action.payload.formData);

        yield put(bannerAddSuccessfully(response?.data));
    } catch (error) {
        yield put(banneraddfail(error?.message));
    }
}

// fetch banner list 
function* fetchBannerListSaga() {
    try {
        const response = yield call(bannerListFetch);
        yield put(fetchBannerSuccess(response?.data));
    } catch (error) {
        yield put(fetchBannerFail(error?.message));
    }
}

//delete banner by id 
function* deleteBannerSaga(action) {
    try {
        const id = action.payload;
        const response = yield call(bannerDeleteApi, id);

        yield put(deleteBannerSuccess(response?.data));
    } catch (error) {
        yield put(deleteBannerFail(error?.message));
    }
}
export default function* bannerSaga() {
    yield takeLatest(addbannerRequest.type, createBannerSaga),
    yield takeLatest(fetchBannerRequest.type, fetchBannerListSaga);
    yield takeLatest(deleteBannerRequest.type, deleteBannerSaga);
}



