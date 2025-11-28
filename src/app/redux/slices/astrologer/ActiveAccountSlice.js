import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    accountloading: false,
    activeaccount: [],
    statusCode:null,
    tagCode:null,

}
const ActiveAccountSlice = createSlice({
    name: "astrologeractive",
    initialState,
    reducers: {
        getAccountList: (state) => {
            state.accountloading = true
        },
        AccountSetSuccess: (state, action) => {
            state.accountloading = false;
            state.activeaccount = action.payload;
            state.statusCode=200;


        },
        FailAccountSetSuccess: (state, action) => {
            state.accountloading = false;
            state.activeaccount = action.payload;
           },

           resetCode:(state)=>{
             state.statusCode=null;
               state.tagCode=null;
           },

           sendTagRequest: (state) =>{
         state.accountloading = true


           },
           updateTagSuccessfully:(state,action)=>{
               state.accountloading = false;
               state.tagCode=201;
           }



    }
});


export const { getAccountList, AccountSetSuccess, 
    FailAccountSetSuccess,resetCode,
    sendTagRequest,updateTagSuccessfully } = ActiveAccountSlice.actions;

export default ActiveAccountSlice.reducer;