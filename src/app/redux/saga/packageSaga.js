import { takeLatest, all, put, call } from "redux-saga/effects";
import axios from "axios";
import { apiroute, AuthHeader } from "../config";
import { packageAddSuccessfully, packageaddfail, sendpackageRequest,
    sendRequestPackage, 
    getSuccessPackage} from "../slices/packageSlice";
    


const apidata = (payload) => {
    const token = AuthHeader();
    const headers = {
    Authorization: `Bearer ${token}`,
  };


  console.log("Headers:", headers);

    return axios.post(apiroute.packageAdd, payload, { headers })
}


const package_Data = ()=>{
return axios.get(apiroute.FETCH_PACKAGE);

}



function* getPackage(){
    try {
      const response=  yield call(package_Data);


      console.log("xxxxxxxxxxxxxxxxxxxxx",response?.data);
     
   yield put(getSuccessPackage());
    } catch (error) {
        console.log(error?.message);
        
    }
}
// create package
function* packageAddSaga(action) {
    try {

        console.log("Package Payload:", action.payload);
        const response = yield call(apidata, action.payload);
        yield put(packageAddSuccessfully(response.data.package));
    } catch (error) {
        console.error("Package add error:", error?.message);
        yield put(packageaddfail(error.message));
    }
}
export default function* packageSaga() {
    yield takeLatest(sendpackageRequest.type, packageAddSaga);
    yield takeLatest(sendRequestPackage.type,getPackage);
}