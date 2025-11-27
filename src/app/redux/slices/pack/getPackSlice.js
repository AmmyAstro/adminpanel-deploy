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
        
    }
});

export const {
    sendRequestPackage,
    sendRequestPackageSuccess,
    sendRequestPackageFail
} = getPackSlice.actions;

export default getPackSlice.reducer;
