import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    packages: [],
    currentPackage: null,
    loading: false,
    error: null,
    adcode: null
};
const packageSlice = createSlice({
    name: "package",
    initialState,
    reducers: {
        sendpackageRequest: (state) => {
            state.loading = true;
        },
        packageAddSuccessfully: (state, action) => {
            state.loading = false;
            state.packages = action.payload;
            state.adcode = 200;
        },
        packageaddfail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        resetPackageCode:(state,action) =>{
            state.adcode=null

        }
    }
});

export const { packageAddSuccessfully, packageaddfail, sendpackageRequest,resetPackageCode } = packageSlice.actions;
export default packageSlice.reducer;
