import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { ProductType, CustomerType } from "../types";
import { customersActions } from "./slices/customerSlice";
import { invoicesActions } from "./slices/invoiceSlice";
import { productsActions } from "./slices/productSlice";
import { RootState } from "./store";

const listenerMiddleware = createListenerMiddleware();

// Sync when product is updated
listenerMiddleware.startListening({
  matcher: isAnyOf(productsActions.updateProduct),
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const updatedProduct = action.payload as ProductType;

    const updatedInvoices = state.invoices.items.map((invoice) => ({
      ...invoice,
      products: invoice.products.map((product) =>
        product.uniqueId === updatedProduct.uniqueId ? updatedProduct : product
      ),
    }));

    listenerApi.dispatch(invoicesActions.setInvoices(updatedInvoices));
  },
});

// Sync when customer is updated
listenerMiddleware.startListening({
  matcher: isAnyOf(customersActions.updateCustomer),
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const updatedCustomer = action.payload as CustomerType;

    const updatedInvoices = state.invoices.items.map((invoice) =>
      invoice.customerName === updatedCustomer.customerName
        ? {
            ...invoice,
            customerName: updatedCustomer.customerName,
          }
        : invoice
    );

    listenerApi.dispatch(invoicesActions.setInvoices(updatedInvoices));
  },
});

export { listenerMiddleware };
