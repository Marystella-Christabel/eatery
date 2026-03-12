import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    cart: [],
    customerInfo: { name: '', phone: '', address: '' },
    deliveryType: 'pickup',
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
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, setCustomerInfo, setDeliveryType, clearCart } = orderSlice.actions;
export default orderSlice.reducer;
