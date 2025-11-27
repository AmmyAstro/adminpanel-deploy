import { call, put, takeLatest } from "redux-saga/effects";
import { sendRequestPackage,sendRequestPackageSuccess,sendRequestPackageFail,
sendUpdateStatus,UpdateStatusResponse,resetUpdatestatus } from "../../slices/pack/getPackSlice";
import axios from "axios";
import { apiroute, AuthHeader } from "../../config";




const fetchPackageApi = () => {
     const token = AuthHeader();
    const headers = {
        Authorization: `Bearer ${token}`
    };
    return axios.get(apiroute.FETCH_PACKAGE,{headers});
};



const updateStatus= (payload) =>{
    const token = AuthHeader();
    const headers = {
        Authorization: `Bearer ${token}`
    };

    return axios.post(apiroute.PACKAGE_STATUS,payload,{headers});
}



function* handlerStatusUpdate(action){
    try {
        
        const response= yield call(updateStatus,action.payload);
        yield put(UpdateStatusResponse(response))
        

    } catch (error) {
        console.log(error.message);
        
    }
}

function* handleSendRequestPackage() {
  try {
    const data = yield call(fetchPackageApi);
    yield put(sendRequestPackageSuccess(data?.data));  
  } catch (err) {
    yield put(sendRequestPackageFail(err.message));
  }
}

export default function* getPackSaga() {
  yield takeLatest(sendRequestPackage.type, handleSendRequestPackage);
  yield takeLatest(sendUpdateStatus.type,handlerStatusUpdate);
}
