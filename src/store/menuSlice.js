import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/client';

export const fetchMenu = createAsyncThunk('menu/fetchMenu', async (_, { rejectWithValue }) => {
  try {
    const data = await api.getMenu();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    items: [],
    categories: ['All', 'Rice', 'Swallow', 'Grill', 'Soups', 'Sides'],
    activeCategory: 'All',
    loading: false,
    error: null,
  },
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        if (action.payload.categories) {
          state.categories = action.payload.categories;
        }
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setActiveCategory } = menuSlice.actions;
export default menuSlice.reducer;
