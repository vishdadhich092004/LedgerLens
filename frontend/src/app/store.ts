import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "../slices/customerSlice";
import invoiceReducer from "../slices/invoiceSlice";
import productReducer from "../slices/productSlice";

const store = configureStore({
  reducer: {
    customers: customerReducer,
    invoices: invoiceReducer,
    products: productReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
