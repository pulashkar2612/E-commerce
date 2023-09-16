import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  cartLength: 0,
};

const getCartSlice = createSlice({
  name: "getCartReducer",
  initialState,
  reducers: {
    getCart(state, action) {
      state.cart = action.payload;
    },
    getCartLength(state, action) {
      state.cartLength = action.payload;
    },
  },
});

export const { getCart, getCartLength } = getCartSlice.actions;
export default getCartSlice.reducer;
