import axios from "axios";
import {call,put,takeLatest} from "redux-saga/effects";
import { API_ENDPOINTS, getAuthHeaders } from "../../config/apiConfig";
import {fetchNotesRequest,
  fetchNotesSuccess,
  fetchNotesFailure,
  addNoteRequest,
  addNoteSuccess,
  addNoteFailure, } from "../../reducer/chat/notesSlice";





const apidata = (payload) => {
   const token = getAuthHeaders();
  const headers = {
    Authorization: `Bearer ${token}`,
  };
 return axios.post(API_ENDPOINTS.Add_note,payload,{headers});


  
};

//  GET data

const getapi  = (note_id) =>{
     const token = getAuthHeaders();
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.get(API_ENDPOINTS.GET_NOTE,{
    headers,
    params:{
      note_id
    }
  })

}



function* addnote(action){
    try { 
   const response = yield call(apidata,action.payload);
     console.log("ADASD",response);
     yield put(addNoteSuccess(response?.data));
        
    } catch (error) {
           yield put(addNoteFailure(error?.message));
    }
}


function* getnotedata (action){
    try {

        const {note_id} =action.payload;




        const response = yield call(getapi,note_id);
        console.log("AXAx",response);
        
        yield put(fetchNotesSuccess(response?.data?.results));

        
    } catch (error) {
       yield put(fetchNotesFailure(error?.message)); 
    }
}



export default function* noteSaga(){
    yield takeLatest(addNoteRequest.type,addnote);
    yield takeLatest(fetchNotesRequest.type,getnotedata);
}