// redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import loginReducer from "./slices/loginSlice";

const rootReducer = combineReducers({
  login: loginReducer,
});

export default rootReducer;
