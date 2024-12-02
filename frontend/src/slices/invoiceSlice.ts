import {
  createAsyncThunk,
  createSlice,
  SerializedError,
  PayloadAction,
} from "@reduxjs/toolkit";
import { InvoiceType } from "../types";

export const fetchInvoices = createAsyncThunk(
  "fetchInvoices",
  async (invoices: InvoiceType[]) => {
    return invoices;
  }
);

interface initialStateProps {
  loading: boolean;
  invoices: InvoiceType[];
  error: SerializedError | null;
}

const initialState: initialStateProps = {
  loading: false,
  invoices: [],
  error: null,
};

const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchInvoices.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchInvoices.fulfilled,
      (state, action: PayloadAction<InvoiceType[]>) => {
        state.invoices = [...state.invoices, ...action.payload];
        state.loading = false;
        state.error = null;
      }
    );
    builder.addCase(fetchInvoices.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  },
});

export default invoiceSlice.reducer;
