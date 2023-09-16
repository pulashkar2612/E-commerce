import { configureStore } from "@reduxjs/toolkit";
import getCartReducer from "./cartReducer";

export default configureStore({
  reducer: {
    getCartReducer,
  },
});
