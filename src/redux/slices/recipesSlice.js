import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firestoreAPI } from '../../services/firestoreService';

export const fetchRecipes = createAsyncThunk('recipes/fetchAll', async () => {
  return await firestoreAPI.getCollection('recipes');
});

export const fetchRecipesByCategory = createAsyncThunk('recipes/fetchByCategory', async (categoryId) => {
  return await firestoreAPI.queryCollection('recipes', [{
    field: { fieldPath: 'categoryId' },
    op: 'EQUAL',
    value: { stringValue: categoryId }
  }]);
});

export const addRecipe = createAsyncThunk('recipes/add', async ({ name, categoryId, ingredients, price, imageUrl }) => {
  const recipeId = Date.now().toString();
  const recipeData = { name, categoryId, ingredients, price, imageUrl: imageUrl || '', createdAt: new Date().toISOString() };
  return await firestoreAPI.createDocument('recipes', recipeData, recipeId);
});

export const updateRecipe = createAsyncThunk('recipes/update', async ({ id, name, categoryId, ingredients, price, imageUrl }) => {
  const data = { name, categoryId, ingredients, price, imageUrl: imageUrl || '', createdAt: new Date().toISOString() };
  return await firestoreAPI.updateDocument('recipes', id, data);
});

export const deleteRecipe = createAsyncThunk('recipes/delete', async (id) => {
  await firestoreAPI.deleteDocument('recipes', id);
  return id;
});

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    items: [],
    loading: false,
    error: null,
    searchResults: []
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    searchRecipes: (state, action) => {
      const query = action.payload.toLowerCase();
      state.searchResults = state.items.filter(recipe => 
        recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients?.some(ing => ing.toLowerCase().includes(query))
      );
    },
    clearSearch: (state) => {
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchRecipesByCategory.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export const { clearError, searchRecipes, clearSearch } = recipesSlice.actions;
export default recipesSlice.reducer;
