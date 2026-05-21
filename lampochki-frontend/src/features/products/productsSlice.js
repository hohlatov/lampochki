import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchProducts } from '../../api/productsApi'

export const loadProducts = createAsyncThunk(
  'products/loadProducts',
  async () => {
    return await fetchProducts()
  }
)

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default productsSlice.reducer