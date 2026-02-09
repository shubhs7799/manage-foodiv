import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firestoreAPI } from '../../services/firestoreService';

export const fetchOrders = createAsyncThunk('orders/fetchAll', async () => {
  return await firestoreAPI.getCollection('orders');
});

export const fetchUserOrders = createAsyncThunk('orders/fetchUser', async (userId) => {
  return await firestoreAPI.queryCollection('orders', [{
    field: { fieldPath: 'userId' },
    op: 'EQUAL',
    value: { stringValue: userId }
  }]);
});

export const createOrder = createAsyncThunk('orders/create', async (orderData) => {
  const orderId = Date.now().toString();
  const order = { ...orderData, orderDate: new Date().toISOString(), status: 'Pending' };
  return await firestoreAPI.createDocument('orders', order, orderId);
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }) => {
  return await firestoreAPI.updateDocument('orders', id, { status });
});

const ordersSlice = createSlice({
  name: 'orders',
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
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      });
  }
});

export const { clearError } = ordersSlice.actions;
export default ordersSlice.reducer;
