import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/client';

export const submitOrder = createAsyncThunk('order/submitOrder', async (_, { getState, rejectWithValue }) => {
  try {
    const { cart, customerInfo, deliveryType } = getState().order;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const data = await api.createOrder({
      items: cart,
      customerInfo,
      deliveryType,
      total,
    });

    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    cart: [],
    customerInfo: { name: '', phone: '', address: '' },
    deliveryType: 'pickup',
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.cart.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find(item => item.id === id);
      if (item) {
        if (quantity <= 0) {
          state.cart = state.cart.filter(i => i.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
    },
    setCustomerInfo: (state, action) => {
      state.customerInfo = { ...state.customerInfo, ...action.payload };
    },
    setDeliveryType: (state, action) => {
      state.deliveryType = action.payload;
    },
    clearCart: (state) => {
      state.cart = [];
      state.customerInfo = { name: '', phone: '', address: '' };
      state.deliveryType = 'pickup';
      state.successMessage = null;
    },
    clearOrderStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.cart = [];
        state.customerInfo = { name: '', phone: '', address: '' };
        state.deliveryType = 'pickup';
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, setCustomerInfo, setDeliveryType, clearCart, clearOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
