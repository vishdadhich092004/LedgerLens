import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType } from "../../types";
import { notifyChange } from "../../app/middleware";

interface ProductState {
  loading: boolean;
  items: ProductType[];
  error: string | null;
}

const initialState: ProductState = {
  loading: false,
  items: [],
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Add a new product
    addProduct: (state, action: PayloadAction<ProductType>) => {
      state.items.push(action.payload);
    },
    updateProduct: (
      state,
      action: PayloadAction<{
        productId: string;
        changes: Partial<ProductType>;
      }>
    ) => {
      const { productId, changes } = action.payload;
      const product = state.items.find((item) => item.productId === productId);

      if (product) {
        Object.assign(product, changes);
      }
      notifyChange({ type: "product", id: productId, changes });
    },
  },
});

export const { updateProduct, addProduct } = productSlice.actions;
export const productsReducer = productSlice.reducer;
