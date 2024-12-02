import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import { CustomerType } from "../types";

export const fetchCustomers = createAsyncThunk(
  "fetchCustomers",
  async (customers: CustomerType[]) => {
    return await customers;
  }
);

interface initialStateProps {
  customers: CustomerType[];
  loading: boolean;
  error: SerializedError | null;
}
const initialState: initialStateProps = {
  customers: [],
  loading: false,
  error: null,
};
const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCustomers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchCustomers.fulfilled,
      (state, action: PayloadAction<CustomerType[]>) => {
        state.customers = action.payload;
        state.loading = false;
        state.error = null;
      }
    );
    builder.addCase(fetchCustomers.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  },
});

export default customerSlice.reducer;
