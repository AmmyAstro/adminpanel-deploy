// redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import loginReducer from "./slices/loginSlice";
import bannerReducer from "./slices/bannerSlice"

const rootReducer = combineReducers({
  login: loginReducer,
  banner: bannerReducer,
});

export default rootReducer;
