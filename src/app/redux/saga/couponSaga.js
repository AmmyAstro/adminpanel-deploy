import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";

import {
  fetchCouponsRequest,
  fetchCouponsSuccess,
  fetchCouponsFailure,
  // fetchCouponByIdRequest,
  // fetchCouponByIdSuccess,
  // fetchCouponByIdFailure,
  createCouponRequest,
  createCouponSuccess,
  createCouponFailure,
  // updateCouponRequest,
  // updateCouponSuccess,
  // updateCouponFailure,
  deleteCouponRequest,
  deleteCouponSuccess,
  deleteCouponFailure,
} from "../slices/couponSlice";
import { apiroute, AuthHeader } from "../config";

const apidata = (payload) => {

  // const token = AuthHeader();
  // const headers = {
  //   Authorization: `Bearer ${token}`
  // };
  return axios.post(apiroute.couponAdd, payload)
}
const couponListFetch = () => {
  return axios.get(apiroute.couponFetch)
}

const couponDeleteApi = (id) => {
  return axios.delete(apiroute.couponDelete(id))
}



// Create
function* createCouponSaga(action) {
  try {
    const response = yield call(apidata, action.payload);
    console.log("saSAs", response?.data);
    yield put(createCouponSuccess(response.data.coupon));
  } catch (error) {
    console.error("Create coupon error:", error);
    yield put(createCouponFailure(error.message));
  }
}


// Fetch all
function* fetchCouponsSaga() {
  try {
    const response = yield call(couponListFetch);
    yield put(fetchCouponsSuccess(response?.data));
  } catch (error) {
    yield put(fetchCouponsFailure(error?.message));
  }
}

// Fetch by ID
// function* fetchCouponByIdSaga(action) {
//   try {
//     const response = yield call(axios.get, `${BASE_URL}/coupons/${action.payload}`);
//     yield put(fetchCouponByIdSuccess(response.data.coupon));
//   } catch (error) {
//     yield put(fetchCouponByIdFailure(error.message));
//   }
// }



// Update
// function* updateCouponSaga(action) {
//   try {
//     const { id, data } = action.payload;
//     const response = yield call(axios.put, `${BASE_URL}/coupons/${id}`, data);
//     yield put(updateCouponSuccess(response.data.coupon));
//   } catch (error) {
//     yield put(updateCouponFailure(error.message));
//   }
// }

// Delete
function* deleteCouponSaga(action) {
  console.log("delete payload:", action.payload);

  try {
    const id = action.payload;
    yield call(couponDeleteApi, id);
    yield put(deleteCouponSuccess(id));
  } catch (error) {
    yield put(deleteCouponFailure(error?.message));
  }
}


export default function* couponSaga() {
  yield takeLatest(fetchCouponsRequest.type, fetchCouponsSaga);
  // yield takeLatest(fetchCouponByIdRequest.type, fetchCouponByIdSaga);
  yield takeLatest(createCouponRequest.type, createCouponSaga);
  // yield takeLatest(updateCouponRequest.type, updateCouponSaga);
  yield takeLatest(deleteCouponRequest.type, deleteCouponSaga);
}
