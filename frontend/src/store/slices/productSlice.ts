import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType } from "../../types";

interface ProductState {
  loading: boolean;
  items: ProductType[];
  error: string | null;
  editingId: string | null;
  originalBeforeEdit: ProductType | null; // Store original state for cancellation
}

const initialState: ProductState = {
  loading: false,
  items: [],
  error: null,
  editingId: null,
  originalBeforeEdit: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Start editing a product
    startEdit: (state, action: PayloadAction<string>) => {
      state.editingId = action.payload;
      // Store original state before editing
      const originalProduct = state.items.find(
        (product) => product.uniqueId === action.payload
      );
      if (originalProduct) {
        state.originalBeforeEdit = { ...originalProduct };
      }
    },

    // Cancel editing and revert changes
    cancelEdit: (state) => {
      if (state.editingId && state.originalBeforeEdit) {
        // Revert to original state if canceling
        const index = state.items.findIndex(
          (product) => product.uniqueId === state.editingId
        );
        if (index !== -1) {
          state.items[index] = state.originalBeforeEdit;
        }
      }
      state.editingId = null;
      state.originalBeforeEdit = null;
    },

    // Update a product and all its references
    updateProduct: (state, action: PayloadAction<ProductType>) => {
      const updatedProduct = action.payload;

      // Update in products array
      const index = state.items.findIndex(
        (product) => product.uniqueId === updatedProduct.uniqueId
      );

      if (index !== -1) {
        // Update the product
        state.items[index] = updatedProduct;
        state.editingId = null;
        state.originalBeforeEdit = null;
      }
    },

    // Add a new product
    addProduct: (state, action: PayloadAction<ProductType>) => {
      state.items.push(action.payload);
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Clear all products
    clearProducts: (state) => {
      state.items = [];
      state.error = null;
      state.editingId = null;
      state.originalBeforeEdit = null;
    },

    // Set products
    setProducts: (state, action: PayloadAction<ProductType[]>) => {
      state.items = action.payload;
    },
  },
});

// Selector to get currently editing product
export const selectEditingProduct = (state: { products: ProductState }) =>
  state.products.editingId
    ? state.products.items.find(
        (product) => product.uniqueId === state.products.editingId
      )
    : null;

// Selector to check if a specific product is being edited
export const selectIsEditingProduct = (
  state: { products: ProductState },
  productId: string
) => state.products.editingId === productId;

export const productsActions = productSlice.actions;
export const productsReducer = productSlice.reducer;
