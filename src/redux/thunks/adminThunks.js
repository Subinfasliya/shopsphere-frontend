import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';
const message = (error) => error.response?.data?.message || 'Request failed';
export const fetchAdminDashboard = createAsyncThunk('admin/dashboard', async (_, { rejectWithValue }) => { try { const { data } = await api.get('/admin/dashboard'); return data.data; } catch (e) { return rejectWithValue(message(e)); } });
export const fetchCustomers = createAsyncThunk('admin/customers', async (params = {}, { rejectWithValue }) => { try { const { data } = await api.get('/admin/customers', { params }); return data.data; } catch (e) { return rejectWithValue(message(e)); } });
export const fetchCustomerDetails = createAsyncThunk('admin/customer', async (id, { rejectWithValue }) => { try { const { data } = await api.get(`/admin/customers/${id}`); return data.data; } catch (e) { return rejectWithValue(message(e)); } });
export const updateCustomerStatus = createAsyncThunk('admin/customerStatus', async ({ id, isActive }, { rejectWithValue }) => { try { const { data } = await api.patch(`/admin/customers/${id}/status`, { isActive }); return data.data; } catch (e) { return rejectWithValue(message(e)); } });
