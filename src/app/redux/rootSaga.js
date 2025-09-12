// redux/sagas/rootSaga.js
import { all } from "redux-saga/effects";
import loginSaga from "./saga/loginSaga";

export default function* rootSaga() {
  yield all([loginSaga()]);
}
