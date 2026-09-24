import { createSlice } from '@reduxjs/toolkit';
import { createCodOrder, createPaypalOrder, capturePaypalOrder, cancelOrder, confirmDelivery, requestReturn, confirmReturn, fetchMyOrders, fetchAllOrders, updateOrderStatus } from '../thunks/orderThunks';

const orderSlice = createSlice({
  name: 'orders',
  initialState: { items: [], allOrders: [], allOrdersPagination: { page: 1, pages: 1, total: 0, limit: 10 }, current: null, loading: false, paymentLoading: false, error: null },
  reducers: { clearOrderError(state) { state.error = null; }, clearCurrentOrder(state) { state.current = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(createCodOrder.pending, (state) => { state.loading = true; state.error = null; state.current = null; })
      .addCase(createCodOrder.fulfilled, (state, action) => { state.loading = false; state.current = action.payload.order; })
      .addCase(createCodOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createPaypalOrder.pending, (state) => { state.paymentLoading = true; state.error = null; })
      .addCase(createPaypalOrder.fulfilled, (state) => { state.paymentLoading = false; })
      .addCase(createPaypalOrder.rejected, (state, action) => { state.paymentLoading = false; state.error = action.payload; })
      .addCase(capturePaypalOrder.pending, (state) => { state.paymentLoading = true; state.error = null; })
      .addCase(capturePaypalOrder.fulfilled, (state, action) => { state.paymentLoading = false; state.current = action.payload.order; })
      .addCase(capturePaypalOrder.rejected, (state, action) => { state.paymentLoading = false; state.error = action.payload; })
      .addCase(cancelOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(cancelOrder.fulfilled, (state, action) => { state.loading = false; state.items = state.items.map((order) => order._id === action.payload.order._id ? action.payload.order : order); })
      .addCase(cancelOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(confirmDelivery.fulfilled, (state, action) => { state.items = state.items.map((order) => order._id === action.payload.order._id ? action.payload.order : order); })
      .addCase(requestReturn.fulfilled, (state, action) => { state.items = state.items.map((order) => order._id === action.payload.order._id ? action.payload.order : order); })
      .addCase(confirmReturn.fulfilled, (state, action) => { state.items = state.items.map((order) => order._id === action.payload.order._id ? action.payload.order : order); })
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.orders; })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchAllOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllOrders.fulfilled, (state, action) => { state.loading = false; state.allOrders = action.payload.orders; state.allOrdersPagination = action.payload.pagination; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => { state.allOrders = state.allOrders.map((order) => order._id === action.payload.order._id ? action.payload.order : order); })
      .addCase(updateOrderStatus.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearOrderError, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
