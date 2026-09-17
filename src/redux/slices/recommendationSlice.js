import { createSlice } from '@reduxjs/toolkit';
import { fetchRecommendations } from '../thunks/recommendationThunks';
const slice=createSlice({name:'recommendations',initialState:{items:[],loading:false,error:null},reducers:{},extraReducers:b=>{b.addCase(fetchRecommendations.pending,s=>{s.loading=true}).addCase(fetchRecommendations.fulfilled,(s,a)=>{s.loading=false;s.items=a.payload.products||[]}).addCase(fetchRecommendations.rejected,(s,a)=>{s.loading=false;s.error=a.payload})}});
export default slice.reducer;
