import { call, put, takeLatest, all } from "redux-saga/effects";
import axios from "axios";
import { apiroute } from "../config";
import { addGiftFail, addGiftRequest, addGiftSuccess } from "../slices/addGiftSlice";

const apidata = (payload) => {
    console.log("payload h ye", payload);

    return axios.post(apiroute.addGift, payload)

}

function* createAddGiftSaga(action) {
    try {
        console.log("payload data here", action.payload.formData);
        const response = yield call(apidata, action.payload.formData);
        console.log("response h ye ", response)
        yield put(addGiftSuccess(response?.data));
    } catch (error) {
        console.log("erro h ye ", error.message);

        yield put(addGiftFail(error?.message));
    }
}

export default function* addGiftSaga() {
    yield takeLatest(addGiftRequest.type, createAddGiftSaga)
}