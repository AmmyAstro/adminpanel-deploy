import axios from "axios";
import { call, put, takeLatest, select } from "redux-saga/effects";
import { RequestCustomerDetail, getCustomerData, getFailCustomer } from "../../slices/customer/customerDetail";
import { apiroute } from "../../config";

const customerapi = (payload) => {
    console.log("ASasaS", payload);
    return axios.get(apiroute.CUSTOMER_PROFILE, {
        params: payload,
    });
};


function* getCustomerDetail(action) {
    try {
        const { customer_id } = action.payload;
        const response = yield call(customerapi, { customer_id });

        yield put(getCustomerData(response?.data));
    } catch (error) {
        console.log("asaSA", error?.message);
        yield put(getFailCustomer(error?.message));
    }
}


export default function* CustomerDetailSaga() {
    yield takeLatest(RequestCustomerDetail.type, getCustomerDetail);
}
