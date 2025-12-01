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
import getCallHistory from "./slices/callhistory/getCallHistory.js"
import giftSlice from "./slices/gift/giftSlice.js";
import WalletSlice from "./slices/wallet/WalletSlice.js";
import getCustomer from "./slices/customer/getCustomer.js";

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
  getpackage:getPackSlice,
  callhistory:getCallHistory,
  gift:giftSlice,
  astrologerWallet:WalletSlice,
  getcustomer:getCustomer
});

export default rootReducer;
