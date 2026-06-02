import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/client';

// Async thunks
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const data = await api.signin(credentials);
    localStorage.setItem('galaxy_token', data.token);
    localStorage.setItem('galaxy_user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const signupUser = createAsyncThunk('auth/signupUser', async (userData, { rejectWithValue }) => {
  try {
    const data = await api.signup(userData);
    localStorage.setItem('galaxy_token', data.token);
    localStorage.setItem('galaxy_user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Validate stored token on app load — hits /auth/me to check if it's still valid
export const validateToken = createAsyncThunk('auth/validateToken', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('galaxy_token');
    if (!token) {
      return rejectWithValue('No token stored');
    }
    const data = await api.getMe();
    // Update stored user with fresh data from server
    localStorage.setItem('galaxy_user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    // Token is invalid/expired — clean up
    localStorage.removeItem('galaxy_token');
    localStorage.removeItem('galaxy_user');
    return rejectWithValue(error.message);
  }
});

// Fetch the authenticated user's order history
export const fetchMyOrders = createAsyncThunk('auth/fetchMyOrders', async (_, { rejectWithValue }) => {
  try {
    const data = await api.getMyOrders();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Restore user from localStorage on load
const savedUser = localStorage.getItem('galaxy_user');
const savedToken = localStorage.getItem('galaxy_token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: !!(savedUser && savedToken),
    loading: false,
    error: null,
    tokenValidated: false, // tracks whether we've verified the token with the server
    myOrders: [],
    ordersLoading: false,
    ordersError: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.tokenValidated = false;
      state.myOrders = [];
      localStorage.removeItem('galaxy_token');
      localStorage.removeItem('galaxy_user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.tokenValidated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.tokenValidated = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Validate token
      .addCase(validateToken.pending, (state) => {
        // Don't show loading spinners for background validation
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.tokenValidated = true;
      })
      .addCase(validateToken.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.tokenValidated = true;
      })
      // Fetch my orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
