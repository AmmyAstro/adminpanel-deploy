import {call,put,takeLatest} from "redux-saga/effects";
import { apiroute, AuthHeader } from "../../config";
import axios from "axios";
import { getAccountList,AccountSetSuccess,FailAccountSetSuccess,
    sendTagRequest,updateTagSuccessfully,
    sendManagePriceRequest,managePriceSuccessfully } from "../../slices/astrologer/ActiveAccountSlice";

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

const manageprice= (payload) =>{

    console.log("Aas",payload);
        const token = AuthHeader();
         const headers = {
              Authorization: `Bearer ${token}`,
               };

  return axios.post(apiroute.ASTROLOGER_MANAGEPRICE,payload,{headers})
    
}



function* AstrologerManagePrice(action){
    try {

        console.log("ASAsaS",action.payload);
   
        const response = yield call(manageprice,action.payload);

        console.log("res",response);
        if(response?.status===201){
        yield put(managePriceSuccessfully(response?.data))

        }else{
            console.log("errror");
        }
        
    } catch (error) {
        console.log("eroror",error?.message);
        
    }
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
 yield takeLatest(sendManagePriceRequest.type,AstrologerManagePrice);
}