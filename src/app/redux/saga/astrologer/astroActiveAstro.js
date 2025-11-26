import {call,put,takeLatest} from "redux-saga/effects";
import { apiroute } from "../../config";
import axios from "axios";
import { getAccountList,AccountSetSuccess,FailAccountSetSuccess } from "../../slices/astrologer/ActiveAccountSlice";

const astroaccount = (payload) =>{

return axios.post(apiroute.ASTROLOGER_ACCOUNT_ACTIVE,payload);
}

function* ActiveAstrologer(action){
try {
const response= yield call (astroaccount,action.payload);
yield put(AccountSetSuccess(response?.data))
} catch (error) {
 yield put(FailAccountSetSuccess(error?.message))
 }
}



export default function* getAstroSaga(){
 yield takeLatest(getAccountList.type,ActiveAstrologer);
}