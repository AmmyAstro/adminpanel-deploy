import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    loading: false,
    customerlist: [],

}



const getCustomer = createSlice({
    name: "getcustomer",
    initialState,
    reducers: {
        sendRequestCustomer: (state) => {
            state.loading = true;

        },
        FetchCustomerList: (state, action) => {
            state.loading = false;
            state.customerlist = action.payload;
        },
        FetchCustomerFail: (state, action) => {
            state.loading = false;
            state.customerlist = action.payload;
        }

    }


})
export const { sendRequestCustomer, FetchCustomerList, FetchCustomerFail } = getCustomer.actions;
export default getCustomer.reducer;
