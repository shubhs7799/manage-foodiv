import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import Fuse from 'fuse.js';

export const fetchRecipes = createAsyncThunk('recipes/fetchAll', async () => {
  return await api.get('/recipes');
});

export const fetchRecipesByCategory = createAsyncThunk('recipes/fetchByCategory', async (categoryId) => {
  return await api.get(`/recipes?categoryId=${categoryId}`);
});

export const addRecipe = createAsyncThunk('recipes/add', async ({ name, categoryId, ingredients, price, imageUrl }) => {
  return await api.post('/recipes', { name, categoryId, ingredients, price, imageUrl });
});

export const updateRecipe = createAsyncThunk('recipes/update', async ({ id, name, categoryId, ingredients, price, imageUrl }) => {
  return await api.put(`/recipes/${id}`, { name, categoryId, ingredients, price, imageUrl });
});

export const deleteRecipe = createAsyncThunk('recipes/delete', async (id) => {
  await api.delete(`/recipes/${id}`);
  return id;
});

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: { items: [], categoryItems: [], loading: false, error: null, searchResults: [] },
  reducers: {
    clearError: (state) => { state.error = null; },
    searchRecipes: (state, action) => {
      const fuse = new Fuse(state.items, {
        keys: ['name', 'ingredients'],
        threshold: 0.4,
      });
      state.searchResults = fuse.search(action.payload).map(r => r.item);
    },
    clearSearch: (state) => { state.searchResults = []; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRecipes.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchRecipes.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(fetchRecipesByCategory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRecipesByCategory.fulfilled, (state, action) => { state.loading = false; state.categoryItems = action.payload; })
      .addCase(fetchRecipesByCategory.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(addRecipe.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const i = state.items.findIndex(item => item.id === action.payload.id);
        if (i !== -1) state.items[i] = action.payload;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export const { clearError, searchRecipes, clearSearch } = recipesSlice.actions;
export default recipesSlice.reducer;
