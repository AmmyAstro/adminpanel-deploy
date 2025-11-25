import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    astrologerloading: false,
    astrologerdata: []

}

const AstrologerDetail = createSlice({
    name: "astrologerdetail",
    initialState,
    reducers: {
        RequestAstrologerDetail: (state) => {
            state.astrologerloading = true;
        },
        getAstrologerData: (state, action) => {
            state.astrologerloading = false;
            state.astrologerdata = action.payload;

        },

        getFailAstrologer: (state, action) => {
            state.astrologerdata = action.payload;
            state.astrologerloading = false;

        }

    }
})



export const { RequestAstrologerDetail, getAstrologerData, getFailAstrologer } = AstrologerDetail.actions;
export default AstrologerDetail.reducer;