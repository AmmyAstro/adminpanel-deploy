import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  fetchCouponsRequest,
  fetchCouponsSuccess,
  fetchCouponsFailure,
  fetchCouponByIdRequest,
  fetchCouponByIdSuccess,
  fetchCouponByIdFailure,
  createCouponRequest,
  createCouponSuccess,
  createCouponFailure,
  updateCouponRequest,
  updateCouponSuccess,
  updateCouponFailure,
  deleteCouponRequest,
  deleteCouponSuccess,
  deleteCouponFailure,
} from "../slices/couponSlice";

const BASE_URL = "http://localhost:5000/api"; // your backend URL

// Create
function* createCouponSaga(action) {
  console.log("Payload received:", action.payload); // confirm payload
  try {
    const response = yield call(
      axios.post,
      `${BASE_URL}/coupons/add`,
      action.payload
    );
    yield put(createCouponSuccess(response.data.coupon));
  } catch (error) {
    console.error("Create coupon error:", error);
    yield put(createCouponFailure(error.message));
  }
}


// Fetch all
function* fetchCouponsSaga() {
  try {
    const response = yield call(axios.get, `${BASE_URL}/coupons`);
    yield put(fetchCouponsSuccess(response.data.coupons));
  } catch (error) {
    yield put(fetchCouponsFailure(error.message));
  }
}

// Fetch by ID
function* fetchCouponByIdSaga(action) {
  try {
    const response = yield call(axios.get, `${BASE_URL}/coupons/${action.payload}`);
    yield put(fetchCouponByIdSuccess(response.data.coupon));
  } catch (error) {
    yield put(fetchCouponByIdFailure(error.message));
  }
}



// Update
function* updateCouponSaga(action) {
  try {
    const { id, data } = action.payload;
    const response = yield call(axios.put, `${BASE_URL}/coupons/${id}`, data);
    yield put(updateCouponSuccess(response.data.coupon));
  } catch (error) {
    yield put(updateCouponFailure(error.message));
  }
}

// Delete
function* deleteCouponSaga(action) {
  try {
    const id = action.payload;
    yield call(axios.delete, `${BASE_URL}/coupons/${id}`);
    yield put(deleteCouponSuccess(id));
  } catch (error) {
    yield put(deleteCouponFailure(error.message));
  }
}

export default function* couponSaga() {
  yield takeLatest(fetchCouponsRequest.type, fetchCouponsSaga);
  yield takeLatest(fetchCouponByIdRequest.type, fetchCouponByIdSaga);
  yield takeLatest(createCouponRequest.type, createCouponSaga);
  yield takeLatest(updateCouponRequest.type, updateCouponSaga);
  yield takeLatest(deleteCouponRequest.type, deleteCouponSaga);
}
