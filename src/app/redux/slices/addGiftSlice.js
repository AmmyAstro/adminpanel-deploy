import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    add: {
        loading: false,
        success: false,
        error: null,
    },
    list: {
        loading: false,
        data: [],
        error: null,
    },
};

const giftSlice = createSlice({
    name: "gift",
    initialState,
    reducers: {
        // ADD GIFT
        addGiftRequest: (state) => {
            state.add.loading = true;
            state.add.error = null;
        },
        addGiftSuccess: (state) => {
            state.add.loading = false;
            state.add.success = true;
        },
        addGiftFail: (state, action) => {
            state.add.loading = false;
            state.add.error = action.payload;
        },

        // FETCH GIFTS
        fetchGiftRequest: (state) => {
            state.list.loading = true;
        },
        fetchGiftSuccess: (state, action) => {
            state.list.loading = false;
            state.list.data = action.payload.giftList; 
        },
        fetchGiftFail: (state, action) => {
            state.list.loading = false;
            state.list.error = action.payload;
        },

        //Delete Gifts
        deleteGiftRequest: (state) => {
            state.list.loading = true;
        },
        deleteGiftSuccess: (state, action) => {
            state.list.loading = false;
            state.list.data = state.list.data.filter(gift => gift.id !== action.payload.id);
        },
        deleteGiftFail: (state, action) => {
            state.list.loading = false;
            state.list.error = action.payload;
        },
    },
});

export const {
    addGiftRequest,
    addGiftSuccess,
    addGiftFail,
    fetchGiftRequest,
    fetchGiftSuccess,
    fetchGiftFail,
    deleteGiftRequest,
    deleteGiftSuccess,
    deleteGiftFail,
} = giftSlice.actions;

export default giftSlice.reducer;
