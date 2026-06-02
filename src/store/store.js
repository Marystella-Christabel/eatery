import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import menuReducer from './menuSlice';
import orderReducer from './orderSlice';
import adminReducer from './adminSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    order: orderReducer,
    admin: adminReducer,
  },
});

export default store;
