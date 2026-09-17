import { createSlice } from '@reduxjs/toolkit';
import { fetchProducts, fetchProductById, fetchCategories } from '../thunks/productThunks';

const initialState = {
  items: [],
  current: null,
  categories: [],
  pagination: { page: 1, pages: 1, total: 0, limit: 12 },
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct(state) { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.items; state.pagination = action.payload.pagination; })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchProductById.pending, (state) => { state.loading = true; state.error = null; state.current = null; })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.loading = false; state.current = action.payload.product; })
      .addCase(fetchProductById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload.categories; });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
