import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const signUp = createAsyncThunk('auth/signUp', async ({ email, password, name }) => {
  const data = await api.post('/auth/signup', { email, password, name });
  localStorage.setItem('authToken', data.token);
  return data.user;
});

export const signIn = createAsyncThunk('auth/signIn', async ({ email, password }) => {
  const data = await api.post('/auth/login', { email, password });
  localStorage.setItem('authToken', data.token);
  return data.user;
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No token');
  const data = await api.get('/auth/me');
  return data.user;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('authToken') || null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('authToken');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = localStorage.getItem('authToken');
        state.isAuthenticated = true;
      })
      .addCase(signUp.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(signIn.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = localStorage.getItem('authToken');
        state.isAuthenticated = true;
      })
      .addCase(signIn.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = localStorage.getItem('authToken');
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        localStorage.removeItem('authToken');
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
