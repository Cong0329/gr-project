import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { CartItem } from './cartSlice';

export const fetchProducts = createAsyncThunk(
  'cart/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://65e695fbd7f0758a76e897e1.mockapi.io/api/v1/medicine'); // Thay bằng endpoint API của bạn
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to load products');
    }
  }
);

export const addToCartAPI = createAsyncThunk(
  'cart/addToCartAPI',
  async (product: CartItem, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://65e695fbd7f0758a76e897e1.mockapi.io/api/v1/medicine', product); // Thay bằng endpoint API của bạn
      return response.data; // Giả sử API trả về giỏ hàng sau khi thêm sản phẩm
    } catch (error) {
      return rejectWithValue('Failed to add product to cart');
    }
  }
);

export const updateQuantityAPI = createAsyncThunk(
    'cart/updateQuantityAPI',
    async ({ id, quantity }: { id: string; quantity: number }, { rejectWithValue }) => {
      try {
        // Gửi PUT request để cập nhật số lượng sản phẩm
        const response = await axios.put(`https://65e695fbd7f0758a76e897e1.mockapi.io/api/v1/medicine/${id}`, { quantity }); // Thay URL với endpoint thực tế
        return response.data; // Giả sử API trả về giỏ hàng đã cập nhật
      } catch (error) {
        return rejectWithValue('Failed to update product quantity');
      }
    }
  );

  export const removeFromCartAPI = createAsyncThunk(
    'cart/removeFromCartAPI',
    async (id: string, { rejectWithValue }) => {
      try {
        // Gửi DELETE request để xóa sản phẩm khỏi giỏ hàng
        const response = await axios.delete(`https://65e695fbd7f0758a76e897e1.mockapi.io/api/v1/medicine/${id}`); // Thay URL với endpoint thực tế
        return response.data; // Giả sử API trả về giỏ hàng đã cập nhật
      } catch (error) {
        return rejectWithValue('Failed to remove product from cart');
      }
    }
  );
  export const updateSelectedOptionAPI = createAsyncThunk(
    'cart/updateSelectedOptionAPI',
    async ({ id, selectedOption }: { id: string; selectedOption: string }, { rejectWithValue }) => {
      try {
        // Gửi PUT request để cập nhật tùy chọn đã chọn
        const response = await axios.put(`https://65e695fbd7f0758a76e897e1.mockapi.io/api/v1/medicine/${id}`, { selectedOption }); // Thay URL với endpoint thực tế
        return response.data; // Giả sử API trả về giỏ hàng đã cập nhật
      } catch (error) {
        return rejectWithValue('Failed to update product option');
      }
    }
  );