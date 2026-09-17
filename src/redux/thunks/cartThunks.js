import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

const errorMessage = (error) => {
  const data = error.response?.data;
  return data?.errors?.length ? `${data.message}: ${data.errors.join(', ')}` : data?.message || 'Cart request failed';
};

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try { const { data } = await api.get('/cart'); return data.data; }
  catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const addCartItem = createAsyncThunk('cart/add', async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  try { const { data } = await api.post('/cart/items', { productId, quantity }); return data.data; }
  catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ productId, quantity }, { rejectWithValue }) => {
  try { const { data } = await api.patch(`/cart/items/${productId}`, { quantity }); return data.data; }
  catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const removeCartItem = createAsyncThunk('cart/remove', async (productId, { rejectWithValue }) => {
  try { const { data } = await api.delete(`/cart/items/${productId}`); return data.data; }
  catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const clearServerCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try { const { data } = await api.delete('/cart'); return data.data; }
  catch (error) { return rejectWithValue(errorMessage(error)); }
});
