// redux/sagas/rootSaga.js
import { all } from "redux-saga/effects";
import loginSaga from "./saga/loginSaga";
import bannerSaga from "./saga/bannerSaga";
import addGiftSaga from "./saga/addGiftSaga";
import testimonialSaga from "./saga/testimonialSaga";

export default function* rootSaga() {
  yield all([loginSaga(),bannerSaga(), addGiftSaga(),testimonialSaga()]);

}
