import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading : false,
    response : [],
};

const addGiftSlice = createSlice({
    name:"addGift",
    initialState,
     gifts: [],   
    reducers: {

        // creating or adding new gift

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
        },

        // fetching or getting all gift list 
        fetchGiftRequest: (state, action) => {
            state.loading = true;
        },
        fetchGiftSuccess: (state, action) => {
            state.loading = false;
            state.response = action.payload;
        },
        fetchGiftFail: (state, action) => {
            state.loading = false;
            state.response = action.payload;
        },
        
    }
});

export const {addGiftRequest, addGiftSuccess, addGiftFail, fetchGiftRequest, fetchGiftSuccess, fetchGiftFail} = addGiftSlice.actions;

export default addGiftSlice.reducer;