import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    loading: false,
    chatData: []
}

const viewChatHistory = createSlice({
    name: '',
    initialState,
    reducers: {
        getChatHistory: (state) => {
            state.loading = true;

        },
        getChatHistoryData: (state, action) => {
            state.loading = false;
            state.chatData = action.payload;


        },
        getChatHistoryFail: (state,action) => {
            state.loading = false;
state.chatData = action.payload;
        }
    }
})





export const {getChatHistory,getChatHistoryData,getChatHistoryFail} = viewChatHistory.actions;
export default viewChatHistory.reducer;