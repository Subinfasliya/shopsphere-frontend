import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, loadCurrentUser, logoutUser, updateProfile, forgotPassword, resetPassword, changePassword } from '../thunks/authThunks';

const initialState = {
  user: null,
  isAuthenticated: false,
  initialized: false,
  loading: false,
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) { state.error = null; },
    clearAuthMessage(state) { state.message = null; },
    clearAuthState(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.isAuthenticated = true; state.message = 'Welcome back.'; })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.isAuthenticated = true; state.message = 'Account created.'; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(loadCurrentUser.pending, (state) => { state.loading = true; })
      .addCase(loadCurrentUser.fulfilled, (state, action) => { state.loading = false; state.initialized = true; state.user = action.payload.authenticated ? action.payload.user : null; state.isAuthenticated = Boolean(action.payload.authenticated); })
      .addCase(loadCurrentUser.rejected, (state) => { state.loading = false; state.initialized = true; state.user = null; state.isAuthenticated = false; })
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; state.isAuthenticated = false; state.message = 'Logged out.'; })
      .addCase(updateProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateProfile.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.message = 'Profile updated.'; })
      .addCase(updateProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(changePassword.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(changePassword.fulfilled, (state, action) => { state.loading = false; state.message = action.payload.message; state.user = null; state.isAuthenticated = false; })
      .addCase(changePassword.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(forgotPassword.pending, (state) => { state.loading = true; state.error = null; state.message = null; })
      .addCase(forgotPassword.fulfilled, (state, action) => { state.loading = false; state.message = action.payload.message; })
      .addCase(forgotPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(resetPassword.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(resetPassword.fulfilled, (state, action) => { state.loading = false; state.message = action.payload.message; })
      .addCase(resetPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearAuthError, clearAuthMessage, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
