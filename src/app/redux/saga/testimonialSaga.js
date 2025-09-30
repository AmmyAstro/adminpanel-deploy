import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  addTestimonialRequest,
  addTestimonialSuccess,
  addTestimonialFailure,
  fetchTestimonialsRequest,
  fetchTestimonialsSuccess,
  fetchTestimonialsFailure,
  fetchTestimonialRequest,
  fetchTestimonialSuccess,
  fetchTestimonialFailure,
  updateTestimonialRequest,
  updateTestimonialSuccess,
  updateTestimonialFailure,
  deleteTestimonialRequest,
  deleteTestimonialSuccess,
  deleteTestimonialFailure,
} from "../slices/testimonialSlice";

// Base API URL

const BASE_URL = "http://localhost:5000/api/testimonials";

// ---------------- Add Testimonial ----------------
function* addTestimonialSaga(action) {
  try {
    const { formData, fileName } = action.payload;
    const response = yield call(
      axios.post,
      `${BASE_URL}/add`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    yield put(
      addTestimonialSuccess({
        ...response.data.testimonial,
        fileName: fileName || null,
      })
    );
  } catch (err) {
    yield put(addTestimonialFailure(err.response?.data?.message || err.message));
  }
}

// ---------------- Fetch All Testimonials ----------------
function* fetchTestimonialsSaga() {
  try {
    const response = yield call(axios.get, `${BASE_URL}`);
    yield put(fetchTestimonialsSuccess(response.data.testimonials));
  } catch (err) {
    yield put(fetchTestimonialsFailure(err.response?.data?.message || err.message));
  }
}

// ---------------- Fetch Single Testimonial ----------------
function* fetchTestimonialSaga(action) {
  try {
    const id = action.payload;
    const response = yield call(axios.get, `${BASE_URL}/${id}`);
    yield put(fetchTestimonialSuccess(response.data.testimonial));
  } catch (err) {
    yield put(fetchTestimonialFailure(err.response?.data?.message || err.message));
  }
}

// ---------------- Update Testimonial ----------------
function* updateTestimonialSaga(action) {
  try {
    const { id, formData } = action.payload;
    const response = yield call(
      axios.put,
      `${BASE_URL}/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    yield put(updateTestimonialSuccess(response.data.testimonial));
  } catch (err) {
    yield put(updateTestimonialFailure(err.response?.data?.message || err.message));
  }
}

// ---------------- Delete Testimonial ----------------
function* deleteTestimonialSaga(action) {
  try {
    const id = action.payload;
    yield call(axios.delete, `${BASE_URL}/${id}`);
    yield put(deleteTestimonialSuccess(id));
  } catch (err) {
    yield put(deleteTestimonialFailure(err.response?.data?.message || err.message));
  }
}

// ---------------- Watcher Saga ----------------
export default function* testimonialSaga() {
  yield takeLatest(fetchTestimonialRequest.type, fetchTestimonialSaga);
  yield takeLatest(addTestimonialRequest.type, addTestimonialSaga);
  yield takeLatest(fetchTestimonialsRequest.type, fetchTestimonialsSaga);
  yield takeLatest(updateTestimonialRequest.type, updateTestimonialSaga);
  yield takeLatest(deleteTestimonialRequest.type, deleteTestimonialSaga);
}
