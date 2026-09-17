import { createSlice } from '@reduxjs/toolkit';
import { fetchCart, addCartItem, updateCartItem, removeCartItem, clearServerCart } from '../thunks/cartThunks';

const normalizeCart = (cart) => ({
  items: (cart?.items || []).filter((item) => item.product).map((item) => ({
    productId: item.product._id,
    name: item.product.name,
    image: item.product.image,
    price: item.product.price,
    stock: item.product.stock,
    quantity: item.quantity,
    category: item.product.category,
    brand: item.product.brand,
  })),
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false, error: null, initialized: false },
  reducers: { clearLocalCart(state) { state.items = []; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCart.fulfilled, (state, action) => { state.loading = false; state.initialized = true; state.items = normalizeCart(action.payload.cart).items; })
      .addCase(fetchCart.rejected, (state, action) => { state.loading = false; state.initialized = true; state.error = action.payload; })
      .addCase(addCartItem.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addCartItem.fulfilled, (state, action) => { state.loading = false; state.items = normalizeCart(action.payload.cart).items; })
      .addCase(addCartItem.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateCartItem.fulfilled, (state, action) => { state.items = normalizeCart(action.payload.cart).items; })
      .addCase(updateCartItem.rejected, (state, action) => { state.error = action.payload; })
      .addCase(removeCartItem.fulfilled, (state, action) => { state.items = normalizeCart(action.payload.cart).items; })
      .addCase(removeCartItem.rejected, (state, action) => { state.error = action.payload; })
      .addCase(clearServerCart.fulfilled, (state) => { state.items = []; })
      .addCase(clearServerCart.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;
