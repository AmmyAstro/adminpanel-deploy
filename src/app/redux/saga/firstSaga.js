import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchAstroRequest,
  fetchAstroSuccess,
  fetchAstroFailure,
} from "../slices/astroSlice";

function fetchAstroApi() {
  return fetch("/api/astro").then((res) => res.json());
}

function* fetchAstroWorker() {
  try {
    const data = yield call(fetchAstroApi);
    yield put(fetchAstroSuccess(data));
  } catch (error) {
    yield put(fetchAstroFailure(error.message));
  }
}

export default function* astroSaga() {
  yield takeLatest(fetchAstroRequest.type, fetchAstroWorker);
}
