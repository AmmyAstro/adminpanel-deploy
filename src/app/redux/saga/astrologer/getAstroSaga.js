import {call,put,takeLatest} from "redux-saga/effects";
import { apiroute, AuthHeader } from "../../config";
import axios from "axios";
import { getRequestList,getAstrologerList,failastroList } from "../../slices/astrologer/GetListSlice";

const astrolist = () =>{
     const token = AuthHeader();
  const headers = {
    Authorization: `Bearer ${token}`,
  };
return axios.get(apiroute.ASTROLOGER_LIST,{headers});
}




function* FetchAstrologer(action){
try {
const response= yield call (astrolist);
yield put(getAstrologerList(response?.data))
} catch (error) {
 yield put(failastroList(error?.message))
 }
}



export default function* getAstroSaga(){
 yield takeLatest(getRequestList.type,FetchAstrologer);
}