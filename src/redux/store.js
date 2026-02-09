import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import categoriesReducer from './slices/categoriesSlice';
import recipesReducer from './slices/recipesSlice';
import cartReducer from './slices/cartSlice';
import ordersReducer from './slices/ordersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    recipes: recipesReducer,
    cart: cartReducer,
    orders: ordersReducer
  }
});
