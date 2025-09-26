// redux/sagas/rootSaga.js
import { all } from "redux-saga/effects";
import loginSaga from "./saga/loginSaga";
import bannerSaga from "./saga/bannerSaga";
import addGiftSaga from "./saga/addGiftSaga";

export default function* rootSaga() {
  yield all([loginSaga(),bannerSaga(), addGiftSaga()]);

}
