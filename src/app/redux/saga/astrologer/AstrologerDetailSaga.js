import axios from "axios";
import { call, put, takeLatest, select } from "redux-saga/effects";
import { RequestAstrologerDetail, getAstrologerData, getFailAstrologer } from "../../slices/astrologer/AstrologerDetail";
import { apiroute } from "../../config";

const astrologerapi = (payload) => {
console.log("ASasaS",payload);
return axios.get(apiroute.ASTROLOGER_PROFILE, {
    params: payload,
  });
};


function* getAstrologerDetail(action) {
  try {
    const { astro_id } = action.payload;
    const response = yield call(astrologerapi, { astro_id });
    
    yield put(getAstrologerData(response?.data));
  } catch (error) {
     console.log("asaSA", error?.message);
     yield put(getFailAstrologer(error?.message));
  }
}


export default function* AstrologerDetailSaga() {
  yield takeLatest(RequestAstrologerDetail.type, getAstrologerDetail);
}
