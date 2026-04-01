import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchOrders = createAsyncThunk('orders/fetchAll', async () => {
  return await api.get('/orders');
});

// fetchUserOrders now uses same endpoint - backend filters by user role
export const fetchUserOrders = createAsyncThunk('orders/fetchUser', async () => {
  return await api.get('/orders');
});

export const createOrder = createAsyncThunk('orders/create', async (orderData) => {
  return await api.post('/orders', orderData);
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }) => {
  return await api.patch(`/orders/${id}/status`, { status });
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchOrders.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchOrders.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(fetchUserOrders.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(createOrder.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const i = state.items.findIndex(item => item.id === action.payload.id);
        if (i !== -1) state.items[i] = action.payload;
      });
  }
});

export const { clearError } = ordersSlice.actions;
export default ordersSlice.reducer;
