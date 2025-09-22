// redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import loginReducer from "./slices/loginSlice";
import bannerReducer from "./slices/bannerSlice";
import addGiftReducer from "./slices/addGiftSlice";



const rootReducer = combineReducers({
  login: loginReducer,
  banner: bannerReducer,
  addGift: addGiftReducer,
});

export default rootReducer;
