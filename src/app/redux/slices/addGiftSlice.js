import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading : false,
    response : [],
};

const addGiftSlice = createSlice({
    name:"addGift",
    initialState,
    reducers: {
        addGiftRequest: (state, action) => {
            state.loading = true;
        },
        addGiftSuccess: (state, action) => {
            state.loading = false;
            state.response = action.payload;
        },
        addGiftFail: (state, action) => {
            state.loading = false;
            state.response = action.payload;
        }
    }
});

export const {addGiftRequest, addGiftSuccess, addGiftFail} = addGiftSlice.actions;

export default addGiftSlice.reducer;