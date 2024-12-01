import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InvoiceType } from "../../types";
import { notifyChange } from "../../app/middleware";

interface InvoiceState {
  loading: boolean;
  items: InvoiceType[];
  error: string | null;
}

const initialState: InvoiceState = {
  loading: false,
  items: [],
  error: null,
};

const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    // Add new invoice
    addInvoice: (state, action: PayloadAction<InvoiceType>) => {
      state.items.push(action.payload);
    },
    updateInvoice: (
      state,
      action: PayloadAction<{
        invoiceNumber: string;
        changes: Partial<InvoiceType>;
      }>
    ) => {
      const { invoiceNumber, changes } = action.payload;
      const invoice = state.items.find(
        (item) => item.invoiceNumber === invoiceNumber
      );
      if (invoice) {
        Object.assign(invoice, changes);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(notifyChange, (state, action) => {
      const { id, type, changes } = action.payload;

      state.items.forEach((invoice) => {
        if (type == "customer" && invoice.customer.customerId === id) {
          invoice.customer = { ...invoice.customer, ...changes };
        }
        if (type === "product") {
          invoice.products = invoice.products.map((product) =>
            product.productId === id ? { ...product, ...changes } : product
          );
        }
      });
    });
  },
});

export const { updateInvoice, addInvoice } = invoiceSlice.actions;
export const invoicesReducer = invoiceSlice.reducer;
