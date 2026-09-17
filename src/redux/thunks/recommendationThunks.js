import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';
export const fetchRecommendations=createAsyncThunk('recommendations/fetch',async(_,{rejectWithValue})=>{try{const {data}=await api.get('/recommendations');return data.data}catch(e){return rejectWithValue(e.response?.data?.message||'Recommendation service unavailable')}});
