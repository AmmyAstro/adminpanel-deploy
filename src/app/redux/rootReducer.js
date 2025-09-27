// redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import loginReducer from "./slices/loginSlice";
import bannerReducer from "./slices/bannerSlice";
import addGiftReducer from "./slices/addGiftSlice";
import testimonialReducer from "./slices/testimonialSlice";



const rootReducer = combineReducers({
  login: loginReducer,
  banner: bannerReducer,
  addGift: addGiftReducer,
  testimonial: testimonialReducer, 
});

export default rootReducer;
