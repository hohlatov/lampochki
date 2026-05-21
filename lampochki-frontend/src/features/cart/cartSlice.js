import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(
        item => item.id === action.payload.id
      )

      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        })
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        item => item.id !== action.payload
      )
    },

    clearCart: state => {
      state.items = []
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload)
      if (item) item.quantity += 1
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload)

      if (item && item.quantity > 1) {
        item.quantity -= 1
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(i => i.id === id)
      if (item && quantity >= 1) {
        item.quantity = quantity
      }
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
} = cartSlice.actions

export const selectCartTotalCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)

export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export default cartSlice.reducer