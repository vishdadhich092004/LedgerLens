import {
  PayloadAction,
  SerializedError,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { ProductType } from "../types";

export const fetchProducts = createAsyncThunk(
  "fetchProducts",
  (products: ProductType[]) => {
    return products;
  }
);

interface initialStateProps {
  loading: boolean;
  error: SerializedError | null;
  products: ProductType[];
}

const initialState: initialStateProps = {
  loading: false,
  error: null,
  products: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchProducts.fulfilled,
      (state, action: PayloadAction<ProductType[]>) => {
        state.loading = false;
        state.error = null;
        state.products = [...state.products, ...action.payload];
      }
    );
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
  },
});

export default productSlice.reducer;
