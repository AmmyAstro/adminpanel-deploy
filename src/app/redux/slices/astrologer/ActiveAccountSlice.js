import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    accountloading: false,
    activeaccount: [],
    statusCode:null,

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
           }
    }
});


export const { getAccountList, AccountSetSuccess, FailAccountSetSuccess,resetCode } = ActiveAccountSlice.actions;

export default ActiveAccountSlice.reducer;