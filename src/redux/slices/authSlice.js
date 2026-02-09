import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/authService';
import { firestoreAPI } from '../../services/firestoreService';

export const signUp = createAsyncThunk('auth/signUp', async ({ email, password, name }) => {
  const data = await authAPI.signUp(email, password);
  const userDoc = {
    email: data.email,
    name: name || email.split('@')[0],
    role: 'user',
    createdAt: new Date().toISOString()
  };
  await firestoreAPI.createDocument('users', userDoc, data.localId);
  localStorage.setItem('authToken', data.idToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return { ...userDoc, userId: data.localId, token: data.idToken };
});

export const signIn = createAsyncThunk('auth/signIn', async ({ email, password }) => {
  const data = await authAPI.signIn(email, password);
  
  // Check if user exists in users collection
  let userDoc;
  try {
    userDoc = await firestoreAPI.getDocument('users', data.localId);
  } catch (err) {
    // User doesn't exist in Firestore, create it
    userDoc = {
      email: data.email,
      name: data.email.split('@')[0],
      role: 'user',
      createdAt: new Date().toISOString()
    };
    await firestoreAPI.createDocument('users', userDoc, data.localId);
  }
  
  // Check if email exists in admins collection
  try {
    const admins = await firestoreAPI.getCollection('admins');
    const isAdmin = admins.some(admin => admin.email === data.email);
    if (isAdmin) {
      userDoc.role = 'admin';
      // Update user role in users collection
      await firestoreAPI.updateDocument('users', data.localId, { role: 'admin' });
    }
  } catch (err) {
    // admins collection doesn't exist or error, keep as user
  }
  
  localStorage.setItem('authToken', data.idToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return { ...userDoc, userId: data.localId, token: data.idToken };
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('No token found');
  const userData = await authAPI.getUserData(token);
  const userDoc = await firestoreAPI.getDocument('users', userData.localId);
  return { ...userDoc, userId: userData.localId, token };
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      authAPI.signOut();
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
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
