import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    loading: false,
    astrolist: []
}
const GetListSlice = createSlice({
    name: "astrologerlist",
    initialState,
    reducers: {
        getRequestList: (state) => {
            state.loading = false
        },
        getAstrologerList: (state, action) => {
            state.loading = true;
            state.astrolist = action.payload;


        },
        failastroList: (state, action) => {
            state.loading = false;
            state.astrolist = action.payload;
           },
    }
});


export const { getRequestList, getAstrologerList, failastroList } = GetListSlice.actions;

export default GetListSlice.reducer;