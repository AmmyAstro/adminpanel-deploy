import { createSlice } from "@reduxjs/toolkit";

const getPackSlice = createSlice({
    name: "getpackage",

    initialState: {

        loading: false,

        response: null,
        error: null,
        statusCode:null,
    },

    reducers: {
        sendRequestPackage: (state) => {
            state.loading = true;
        },
        sendRequestPackageSuccess: (state, action) => {
            state.loading = false;
            state.response = action.payload;
        },

        sendRequestPackageFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
       sendUpdateStatus:(state)=>{
            state.loading = true;
     },
     UpdateStatusResponse:(state,action) =>{
        state.loading= false;
        state.statusCode= 200;

     },
     resetUpdatestatus:(state,action)=>{
        state.statusCode= null;
     }

    }
});

export const {
    sendRequestPackage,
    sendRequestPackageSuccess,
    sendRequestPackageFail,
    sendUpdateStatus,
    UpdateStatusResponse,
    resetUpdatestatus
} = getPackSlice.actions;

export default getPackSlice.reducer;
