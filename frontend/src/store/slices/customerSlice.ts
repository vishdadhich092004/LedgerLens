import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomerType } from "../../types";
import { notifyChange } from "../../app/middleware";

interface CustomerState {
  loading: boolean;
  items: CustomerType[];
  error: string | null;
}

const initialState: CustomerState = {
  loading: false,
  items: [],
  error: null,
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    // Add new customer
    addCustomer: (state, action: PayloadAction<CustomerType>) => {
      state.items.push(action.payload);
    },
    updateCustomer: (
      state,
      action: PayloadAction<{
        customerId: string;
        changes: Partial<CustomerType>;
      }>
    ) => {
      const { customerId, changes } = action.payload;
      const customer = state.items.find(
        (item) => item.customerId === customerId
      );
      if (customer) {
        Object.assign(customer, changes);
      }
      notifyChange({ type: "customer", id: customerId, changes });
    },
  },
});

export const { updateCustomer, addCustomer } = customerSlice.actions;
export const customersReducer = customerSlice.reducer;
