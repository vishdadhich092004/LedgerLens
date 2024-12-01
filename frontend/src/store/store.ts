import { configureStore } from "@reduxjs/toolkit";
import { customersReducer } from "./slices/customerSlice";
import { invoicesReducer } from "./slices/invoiceSlice";
import { productsReducer } from "./slices/productSlice";

const store = configureStore({
  reducer: {
    customers: customersReducer,
    invoices: invoicesReducer,
    products: productsReducer,
  },
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
