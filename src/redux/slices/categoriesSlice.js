import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchCategories = createAsyncThunk('categories/fetchAll', async () => {
  return await api.get('/categories');
});

export const addCategory = createAsyncThunk('categories/add', async ({ name, imageUrl }) => {
  return await api.post('/categories', { name, imageUrl });
});

export const updateCategory = createAsyncThunk('categories/update', async ({ id, name, imageUrl }) => {
  return await api.put(`/categories/${id}`, { name, imageUrl });
});

export const deleteCategory = createAsyncThunk('categories/delete', async (id) => {
  await api.delete(`/categories/${id}`);
  return id;
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchCategories.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(addCategory.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const i = state.items.findIndex(item => item.id === action.payload.id);
        if (i !== -1) state.items[i] = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export const { clearError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
