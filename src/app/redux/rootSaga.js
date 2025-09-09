import { all } from "redux-saga/effects";
import astroSaga from "./sagas/astroSaga";

export default function* rootSaga() {
  yield all([astroSaga()]);
}
