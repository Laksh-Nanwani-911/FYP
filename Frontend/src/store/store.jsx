import { configureStore } from "@reduxjs/toolkit";
import CartSlice from './slices/cart'

const Store = configureStore({
  reducer: {
    cart: CartSlice,
  },
});

export default Store;
