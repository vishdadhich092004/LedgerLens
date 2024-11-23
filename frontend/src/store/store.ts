import { configureStore } from "@reduxjs/toolkit";
import { customersReducer } from "./slices/customerSlice";
import { invoicesReducer } from "./slices/invoiceSlice";
import { productsReducer } from "./slices/productSlice";
import { listenerMiddleware } from "./middleware";

const store = configureStore({
  reducer: {
    customers: customersReducer,
    invoices: invoicesReducer,
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
