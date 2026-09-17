import { createSlice } from '@reduxjs/toolkit';
import { fetchWishlist, addWishlist, removeWishlist } from '../thunks/wishlistThunks';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const normalize = (wishlist) => (wishlist?.products || []).filter(Boolean);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlistError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = normalize(action.payload.wishlist);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to load wishlist';
      })
      .addCase(addWishlist.fulfilled, (state, action) => {
        state.items = normalize(action.payload.wishlist);
        state.error = null;
      })
      .addCase(addWishlist.rejected, (state, action) => {
        state.error = action.payload || 'Unable to update wishlist';
      })
      .addCase(removeWishlist.fulfilled, (state, action) => {
        state.items = normalize(action.payload.wishlist);
        state.error = null;
      })
      .addCase(removeWishlist.rejected, (state, action) => {
        state.error = action.payload || 'Unable to update wishlist';
      });
  },
});

export const { clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
