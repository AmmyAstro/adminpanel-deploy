import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    customerloading: false,
    customerdata: []

}

const CustomerDetail = createSlice({
    name: "customerdetail",
    initialState,
    reducers: {
        RequestCustomerDetail: (state) => {
            state.customerloading = true;
        },
        getCustomerData: (state, action) => {
            state.customerloading = false;
            state.customerdata = action.payload;
        },

        getFailCustomer: (state, action) => {
            state.customerdata = action.payload;
            state.customerloading = false;

        }

    }
})



export const { RequestCustomerDetail, getCustomerData, getFailCustomer } = CustomerDetail.actions;
export default CustomerDetail.reducer;