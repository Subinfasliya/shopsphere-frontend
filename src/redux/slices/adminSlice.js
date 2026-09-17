import { createSlice } from '@reduxjs/toolkit';
import { fetchAdminDashboard, fetchCustomers, fetchCustomerDetails, updateCustomerStatus } from '../thunks/adminThunks';

const initialState = { stats: null, customers: [], pagination: { page: 1, pages: 1, total: 0, limit: 20 }, selectedCustomer: null, loading: false, error: null };
const slice = createSlice({
  name: 'admin', initialState, reducers: { clearSelectedCustomer: (state) => { state.selectedCustomer = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAdminDashboard.fulfilled, (s, a) => { s.loading = false; s.stats = a.payload; })
      .addCase(fetchAdminDashboard.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchCustomers.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchCustomers.fulfilled, (s, a) => { s.loading = false; s.customers = a.payload.items; s.pagination = a.payload.pagination; })
      .addCase(fetchCustomers.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchCustomerDetails.fulfilled, (s, a) => { s.selectedCustomer = a.payload; })
      .addCase(updateCustomerStatus.fulfilled, (s, a) => { s.customers = s.customers.map((c) => c._id === a.payload.user._id ? { ...c, ...a.payload.user } : c); if (s.selectedCustomer?.customer?._id === a.payload.user._id) s.selectedCustomer.customer = { ...s.selectedCustomer.customer, ...a.payload.user }; })
      .addCase(updateCustomerStatus.rejected, (s, a) => { s.error = a.payload; });
  },
});
export const { clearSelectedCustomer } = slice.actions;
export default slice.reducer;
