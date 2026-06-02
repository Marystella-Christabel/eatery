import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/client';

// ==================== ASYNC THUNKS ====================

// Stats
export const fetchAdminStats = createAsyncThunk('admin/fetchStats', async (_, { rejectWithValue }) => {
  try {
    return await api.getAdminStats();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Menu
export const fetchAdminMenu = createAsyncThunk('admin/fetchMenu', async (_, { rejectWithValue }) => {
  try {
    return await api.getAdminMenu();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const addMenuItem = createAsyncThunk('admin/addItem', async (itemData, { rejectWithValue }) => {
  try {
    return await api.addMenuItem(itemData);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateMenuItem = createAsyncThunk('admin/updateItem', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await api.updateMenuItem(id, data);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteMenuItem = createAsyncThunk('admin/deleteItem', async (id, { rejectWithValue }) => {
  try {
    await api.deleteMenuItem(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const toggleMenuAvailability = createAsyncThunk('admin/toggleItem', async (id, { rejectWithValue }) => {
  try {
    return await api.toggleMenuItem(id);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Orders
export const fetchAdminOrders = createAsyncThunk('admin/fetchOrders', async (status, { rejectWithValue }) => {
  try {
    return await api.getAdminOrders(status);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateOrderStatus = createAsyncThunk('admin/updateOrderStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    return await api.updateOrderStatus(id, status);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Messages
export const fetchAdminMessages = createAsyncThunk('admin/fetchMessages', async (_, { rejectWithValue }) => {
  try {
    return await api.getAdminMessages();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteAdminMessage = createAsyncThunk('admin/deleteMessage', async (id, { rejectWithValue }) => {
  try {
    await api.deleteAdminMessage(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Customers
export const fetchAdminCustomers = createAsyncThunk('admin/fetchCustomers', async (_, { rejectWithValue }) => {
  try {
    return await api.getAdminCustomers();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// ==================== SLICE ====================

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    // Menu
    menuItems: [],
    loading: false,
    // Stats
    stats: {
      totalItems: 0,
      availableItems: 0,
      totalOrders: 0,
      totalRevenue: 0,
    },
    statsLoading: false,
    // Orders
    orders: [],
    ordersLoading: false,
    // Messages
    messages: [],
    messagesLoading: false,
    // Customers
    customers: [],
    customersLoading: false,
    // Shared
    error: null,
    successMessage: null,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== STATS ==========
      .addCase(fetchAdminStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })

      // ========== MENU ==========
      .addCase(fetchAdminMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menuItems = action.payload.items;
      })
      .addCase(fetchAdminMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add item
      .addCase(addMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.menuItems.push(action.payload.item);
        state.successMessage = 'Menu item added successfully!';
      })
      .addCase(addMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update item
      .addCase(updateMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.menuItems.findIndex((i) => i.id === action.payload.item.id);
        if (index !== -1) {
          state.menuItems[index] = action.payload.item;
        }
        state.successMessage = 'Menu item updated successfully!';
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete item
      .addCase(deleteMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.menuItems = state.menuItems.filter((i) => i.id !== action.payload);
        state.successMessage = 'Menu item deleted!';
      })
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle availability
      .addCase(toggleMenuAvailability.fulfilled, (state, action) => {
        const index = state.menuItems.findIndex((i) => i.id === action.payload.item.id);
        if (index !== -1) {
          state.menuItems[index] = action.payload.item;
        }
      })
      .addCase(toggleMenuAvailability.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ========== ORDERS ==========
      .addCase(fetchAdminOrders.pending, (state) => {
        state.ordersLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload.orders;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.payload;
      })
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o.id === action.payload.order.id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ========== MESSAGES ==========
      .addCase(fetchAdminMessages.pending, (state) => {
        state.messagesLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        state.messages = action.payload.messages;
      })
      .addCase(fetchAdminMessages.rejected, (state, action) => {
        state.messagesLoading = false;
        state.error = action.payload;
      })
      // Delete message
      .addCase(deleteAdminMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter((m) => m.id !== action.payload);
        state.successMessage = 'Message deleted!';
      })
      .addCase(deleteAdminMessage.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ========== CUSTOMERS ==========
      .addCase(fetchAdminCustomers.pending, (state) => {
        state.customersLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminCustomers.fulfilled, (state, action) => {
        state.customersLoading = false;
        state.customers = action.payload.customers;
      })
      .addCase(fetchAdminCustomers.rejected, (state, action) => {
        state.customersLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError, clearSuccessMessage } = adminSlice.actions;
export default adminSlice.reducer;
