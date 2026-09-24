import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

const errorMessage = (error) => {
  const data = error.response?.data;
  return data?.errors?.length ? `${data.message}: ${data.errors.join(', ')}` : data?.message || 'Request failed';
};

export const createCodOrder = createAsyncThunk('orders/createCod', async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post('/orders/cod', payload); return data.data; }
  catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const createPaypalOrder = createAsyncThunk('orders/createPaypal', async (payload, { rejectWithValue }) => {
  try { const { data } = await api.post('/orders/paypal/create', payload); return data.data; }
  catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const capturePaypalOrder = createAsyncThunk('orders/capturePaypal', async (paypalOrderId, { rejectWithValue }) => {
  try { const { data } = await api.post(`/orders/paypal/${paypalOrderId}/capture`); return data.data; }
  catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const cancelPaypalOrder = createAsyncThunk('orders/cancelPaypal', async (paypalOrderId, { rejectWithValue }) => {
  try { const { data } = await api.post(`/orders/paypal/${paypalOrderId}/cancel`); return data.data; }
  catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const cancelOrder = createAsyncThunk('orders/cancel', async (orderId, { rejectWithValue }) => {
  try { const { data } = await api.post(`/orders/${orderId}/cancel`); return data.data; }
  catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const confirmDelivery = createAsyncThunk('orders/confirmDelivery', async ({ orderId, otp }, { rejectWithValue }) => {
  try { const { data } = await api.post(`/orders/${orderId}/confirm-delivery`, { otp }); return data.data; }
  catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const requestReturn = createAsyncThunk('orders/requestReturn', async (orderId, { rejectWithValue }) => {
  try { const { data } = await api.post(`/orders/${orderId}/return-request`); return data.data; }
  catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const confirmReturn = createAsyncThunk('orders/confirmReturn', async ({ orderId, otp }, { rejectWithValue }) => {
  try { const { data } = await api.post(`/orders/${orderId}/return-confirm`, { otp }); return data.data; }
  catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const fetchMyOrders = createAsyncThunk('orders/myOrders', async (_, { rejectWithValue }) => {
  try { const { data } = await api.get('/orders/my-orders'); return data.data; }
  catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const fetchAllOrders = createAsyncThunk('orders/all', async (params = {}, { rejectWithValue }) => {
  try { const { data } = await api.get('/orders', { params }); return data.data; }
  catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, orderStatus }, { rejectWithValue }) => {
  try { const { data } = await api.patch(`/orders/${id}/status`, { orderStatus }); return data.data; }
  catch (error) { return rejectWithValue(errorMessage(error)); }
});
