// redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import loginReducer from "./slices/loginSlice";
import bannerReducer from "./slices/bannerSlice";
import addGiftReducer from "./slices/addGiftSlice";
import testimonialReducer from "./slices/testimonialSlice";
import couponReducer from "./slices/couponSlice";
import GetListSlice from "./slices/astrologer/GetListSlice";
import ActiveAccountSlice from "./slices/astrologer/ActiveAccountSlice";
import AstrologerDetail from "./slices/astrologer/AstrologerDetail";
import chatHistorySlice from "./slices/chathistory/chatHistorySlice";
import getPackSlice from "./slices/pack/getPackSlice.js"

const rootReducer = combineReducers({
  login: loginReducer,
  banner: bannerReducer,
  addGift: addGiftReducer,
  testimonial: testimonialReducer, 
  coupon: couponReducer,
  astrologerlist:GetListSlice,
  astrologeractive:ActiveAccountSlice,
  astrologerdetail:AstrologerDetail,
  chathistory:chatHistorySlice,
  getpackage:getPackSlice
});

export default rootReducer;
