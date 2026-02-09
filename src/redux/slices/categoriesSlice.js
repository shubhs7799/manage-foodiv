import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firestoreAPI } from '../../services/firestoreService';

export const fetchCategories = createAsyncThunk('categories/fetchAll', async () => {
  return await firestoreAPI.getCollection('categories');
});

export const addCategory = createAsyncThunk('categories/add', async ({ name, imageUrl }) => {
  const categoryId = Date.now().toString();
  const categoryData = { name, imageUrl: imageUrl || '', createdAt: new Date().toISOString() };
  return await firestoreAPI.createDocument('categories', categoryData, categoryId);
});

export const updateCategory = createAsyncThunk('categories/update', async ({ id, name, imageUrl }) => {
  const data = { name, imageUrl: imageUrl || '', createdAt: new Date().toISOString() };
  return await firestoreAPI.updateDocument('categories', id, data);
});

export const deleteCategory = createAsyncThunk('categories/delete', async (id) => {
  await firestoreAPI.deleteDocument('categories', id);
  return id;
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export const { clearError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
