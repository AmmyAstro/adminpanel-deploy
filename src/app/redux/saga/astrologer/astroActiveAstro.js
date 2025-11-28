import {call,put,takeLatest} from "redux-saga/effects";
import { apiroute, AuthHeader } from "../../config";
import axios from "axios";
import { getAccountList,AccountSetSuccess,FailAccountSetSuccess,sendTagRequest,updateTagSuccessfully } from "../../slices/astrologer/ActiveAccountSlice";

const astroaccount = (payload) =>{

return axios.post(apiroute.ASTROLOGER_ACCOUNT_ACTIVE,payload);
}



const updatetag = (payload) =>{
    const token = AuthHeader();

     const headers = {
    Authorization: `Bearer ${token}`,
  };

  return axios.post(apiroute.ASTROLOGER_TAG,payload,{headers})
}



function* AstrologerTagUpdate(action){

    

    try {
    const response= yield call (updatetag,action.payload);
   
    if(response?.status === 200){
     yield put(updateTagSuccessfully())
    }else{
        
    }

        
    } catch (error) {
        console.log("aSDasda",error);
        
    }

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
 yield takeLatest (sendTagRequest.type,AstrologerTagUpdate);
}