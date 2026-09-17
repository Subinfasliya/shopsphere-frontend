import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

const errorMessage = (error) => {
  const data = error.response?.data;
  return data?.errors?.length ? `${data.message}: ${data.errors.join(', ')}` : data?.message || 'Request failed';
};

export const fetchProducts = createAsyncThunk('products/list', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products', { params });
    return data.data;
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

export const fetchProductById = createAsyncThunk('products/detail', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data.data;
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

export const fetchCategories = createAsyncThunk('products/categories', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/categories');
    return data.data;
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});
