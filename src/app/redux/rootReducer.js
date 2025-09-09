import { combineReducers } from "redux";
import astroReducer from "./slices/astroSlice";

const rootReducer = combineReducers({
  astro: astroReducer,
});

export default rootReducer;
