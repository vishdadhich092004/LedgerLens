import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InvoiceType } from "../../types";

interface InvoiceState {
  loading: boolean;
  items: InvoiceType[];
  error: string | null;
  // editingId: string | null;
}

const initialState: InvoiceState = {
  loading: false,
  items: [],
  error: null,
  // editingId: null,
};

const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    // Add new invoice
    addInvoice: (state, action: PayloadAction<InvoiceType>) => {
      state.items.push(action.payload);
    },

    // // Delete invoice
    // deleteInvoice: (state, action: PayloadAction<string>) => {
    //   state.invoices = state.invoices.filter(
    //     (invoices: InvoiceType) => invoices.uniqueId !== action.payload
    //   );
    //   if (state.editingId === action.payload) {
    //     state.editingId = null;
    //   }
    // },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Clear all invoices
    clearInvoices: (state) => {
      state.items = [];
      state.error = null;
      // state.editingId = null;
    },
    // Batch update invoices
    setInvoices: (state, action: PayloadAction<InvoiceType[]>) => {
      state.items = action.payload;
    },
  },
});

export const invoicesActions = invoiceSlice.actions;
export const invoicesReducer = invoiceSlice.reducer;
