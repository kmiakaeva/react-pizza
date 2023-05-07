import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { supabase } from '../../config/supabaseClient';

export const fetchPizza = createAsyncThunk('pizza/fetchPizzaData', async (params) => {
  const { categoryId, selectedProperty, searchValue } = params;
  let query = supabase.from('pizza').select();

  if (categoryId > 0) {
    query = query.eq('category', categoryId);
  }
  if (selectedProperty.includes('-')) {
    query = query.order(selectedProperty.replace('-', ''), { ascending: false });
  } else {
    query = query.order(selectedProperty);
  }
  if (searchValue) {
    query = query.ilike('title', `%${searchValue}%`);
  }

  return await query.throwOnError();
});

const initialState = {
  pizza: [],
  status: '',
};

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPizza.pending, (state) => {
      state.pizza = [];
      state.status = 'pending';
    });
    builder.addCase(fetchPizza.fulfilled, (state, action) => {
      state.pizza = action.payload.data;
      state.status = 'success';
    });
    builder.addCase(fetchPizza.rejected, (state, action) => {
      state.pizza = [];
      state.status = 'error';
      console.error(action.error);
    });
  },
});

export const selectPizzaData = (state) => state.pizza;

export default pizzaSlice.reducer;
