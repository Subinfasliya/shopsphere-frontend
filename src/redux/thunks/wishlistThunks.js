import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';
const message = (e) => e.response?.data?.message || 'Wishlist request failed';
export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => { try { const {data}=await api.get('/wishlist'); return data.data; } catch(e){return rejectWithValue(message(e));} });
export const addWishlist = createAsyncThunk('wishlist/add', async (productId,{rejectWithValue})=>{try{const {data}=await api.post('/wishlist',{productId});return data.data;}catch(e){return rejectWithValue(message(e));}});
export const removeWishlist = createAsyncThunk('wishlist/remove', async (productId,{rejectWithValue})=>{try{const {data}=await api.delete(`/wishlist/${productId}`);return data.data;}catch(e){return rejectWithValue(message(e));}});
