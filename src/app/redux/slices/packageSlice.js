import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    packages: [],
    currentPackage: null,
    loading: false,
    error: null,
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
        },
        packageaddfail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

export const { packageAddSuccessfully, packageaddfail, sendpackageRequest } =
    packageSlice.actions;
export default packageSlice.reducer;
