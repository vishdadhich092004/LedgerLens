// customerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomerType } from "../../types";

interface CustomerState {
  loading: boolean;
  items: CustomerType[];
  error: string | null;
  editingId: string | null;
  originalBeforeEdit: CustomerType | null;
}

const initialState: CustomerState = {
  loading: false,
  items: [],
  error: null,
  editingId: null,
  originalBeforeEdit: null,
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    // Start editing a customer
    startEdit: (state, action: PayloadAction<string>) => {
      state.editingId = action.payload;
      // Store original state before editing
      const originalCustomer = state.items.find(
        (customer) => customer.uniqueId === action.payload
      );
      if (originalCustomer) {
        state.originalBeforeEdit = { ...originalCustomer };
      }
    },

    // Cancel editing and revert changes
    cancelEdit: (state) => {
      if (state.editingId && state.originalBeforeEdit) {
        // Revert to original state if canceling
        const index = state.items.findIndex(
          (customer) => customer.uniqueId === state.editingId
        );
        if (index !== -1) {
          state.items[index] = state.originalBeforeEdit;
        }
      }
      state.editingId = null;
      state.originalBeforeEdit = null;
    },

    // Update a customer and all its references
    updateCustomer: (state, action: PayloadAction<CustomerType>) => {
      const updatedCustomer = action.payload;

      // Update in customer array
      const index = state.items.findIndex(
        (customer) => customer.uniqueId === updatedCustomer.uniqueId
      );

      if (index !== -1) {
        // Update the customer
        state.items[index] = updatedCustomer;
        state.editingId = null;
        state.originalBeforeEdit = null;
      }
    },
    // Add new customer
    addCustomer: (state, action: PayloadAction<CustomerType>) => {
      state.items.push(action.payload);
    },

    // Delete customer
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.uniqueId !== action.payload
      );
      if (state.editingId === action.payload) {
        state.editingId = null;
      }
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Clear all customers
    clearCustomers: (state) => {
      state.items = [];
      state.error = null;
      state.editingId = null;
      state.originalBeforeEdit = null;
    },

    // Batch update customers
    setCustomers: (state, action: PayloadAction<CustomerType[]>) => {
      state.items = action.payload;
    },
  },
});

// Selector to get currently editing customer
export const selectEditingCustomer = (state: { customers: CustomerState }) =>
  state.customers.editingId
    ? state.customers.items.find(
        (customer) => customer.uniqueId === state.customers.editingId
      )
    : null;

// Selector to check if a specific customer is being edited
export const selectIsEditingCustomer = (
  state: { customers: CustomerState },
  customerId: string
) => state.customers.editingId === customerId;

export const customersActions = customerSlice.actions;
export const customersReducer = customerSlice.reducer;
