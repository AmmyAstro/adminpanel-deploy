import { createSlice } from "@reduxjs/toolkit";

const getPackSlice = createSlice({
    name: "getpackage",

    initialState: {

        loading: false,

        response: null,
        error: null
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
        sendRequestUpdatePackageStatus: (state) => {
            state.loading = true;
        },
        updatePackStatus: (state, action) => {
            state.response = action.payload;
            state.loading = false;
        }
        
    }
});

export const {
    sendRequestPackage,
    sendRequestPackageSuccess,
    sendRequestPackageFail,
    updatePackStatus,sendRequestUpdatePackageStatus
} = getPackSlice.actions;

export default getPackSlice.reducer;
