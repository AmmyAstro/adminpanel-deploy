import { call, put, takeLatest, all } from "redux-saga/effects";
import axios from "axios";
import { apiroute } from "../config";
import { addGiftFail, addGiftRequest, addGiftSuccess, fetchGiftFail, fetchGiftRequest, fetchGiftSuccess } from "../slices/addGiftSlice";

const apidata = (payload) => {
    return axios.post(apiroute.addGift, payload)
}
const giftListFetch = () => {
    return axios.get(apiroute.giftList)
}

function* createAddGiftSaga(action) {
    try {
        const response = yield call(apidata, action.payload.formData);
        console.log("response h ye ", response)
        yield put(addGiftSuccess(response?.data));
    } catch (error) {
        console.log("erro h ye ", error.message);

        yield put(addGiftFail(error?.message));
    }
};

function* fetchGiftListSaga() {
    try {
        const response = yield call(giftListFetch);
        yield put(fetchGiftSuccess(response?.data));
    } catch (error) {
        yield put(fetchGiftFail(error?.message));
    }
};


export default function* addGiftSaga() {
    yield takeLatest(addGiftRequest.type, createAddGiftSaga);
    yield takeLatest(fetchGiftRequest.type, fetchGiftListSaga);
}