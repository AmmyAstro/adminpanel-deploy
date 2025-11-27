// redux/sagas/rootSaga.js
import { all } from "redux-saga/effects";
import loginSaga from "./saga/loginSaga";
import bannerSaga from "./saga/bannerSaga";
import addGiftSaga from "./saga/addGiftSaga";
import testimonialSaga from "./saga/testimonialSaga";
import couponSaga from "./saga/couponSaga";
import getAstroSaga from "./saga/astrologer/getAstroSaga";
import astroActiveAstro from "./saga/astrologer/astroActiveAstro.js";
import AstrologerDetailSaga from "./saga/astrologer/AstrologerDetailSaga.js";
import chatHistorySaga from "./saga/chathistory/chatHistorySaga.js";
import packageSaga from "./saga/packageSaga";





export default function* rootSaga() {
  yield all([
    loginSaga(),
    bannerSaga(), 
    addGiftSaga(),
    testimonialSaga(),
    couponSaga(),
    getAstroSaga(),
    astroActiveAstro(),
    AstrologerDetailSaga(),
    chatHistorySaga(),
    packageSaga(),
  ]);

}
