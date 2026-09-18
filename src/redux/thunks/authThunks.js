import { createAsyncThunk } from '@reduxjs/toolkit';
import api, { ensureCsrfToken } from '../../api/axiosInstance';

const errorMessage = (error) => {
  const data = error.response?.data;
  return data?.errors?.length ? `${data.message}: ${data.errors.join(', ')}` : data?.message || 'Request failed';
};

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    await ensureCsrfToken();
    const { data } = await api.post('/auth/register', payload);
    return data.data;
  } catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const loginUser = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    await ensureCsrfToken();
    const { data } = await api.post('/auth/login', payload);
    return data.data;
  } catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const loadCurrentUser = createAsyncThunk('auth/session', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/session');
    return data.data;
  } catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout');
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.patch('/users/profile', payload);
    return data.data;
  } catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const changePassword = createAsyncThunk('auth/changePassword', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.patch('/users/password', payload);
    return data;
  } catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  } catch (error) { return rejectWithValue(errorMessage(error)); }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, newPassword }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/auth/reset-password/${encodeURIComponent(token)}`, { newPassword });
    return data;
  } catch (error) { return rejectWithValue(errorMessage(error)); }
});
