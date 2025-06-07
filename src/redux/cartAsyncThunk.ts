import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCarts = createAsyncThunk(
  'cart/fetchCarts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/cart`, {
        withCredentials: true
      });
      return response.data;
    } catch (error:unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);

export const addToCartAPI = createAsyncThunk(
  'cart/addToCartAPI',
  async ({product_id, quantity, option_id}: {product_id: string, quantity: number, option_id: string}, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/cart`, {product_id, quantity, option_id}, {
        withCredentials: true
      });
      return response.data; // Giả sử API trả về giỏ hàng sau khi thêm sản phẩm
    } catch (error:unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);

export const updateQuantityAPI = createAsyncThunk(
    'cart/updateQuantityAPI',
    async ({ cartItemId, quantity }: { cartItemId: string; quantity: number}, { rejectWithValue }) => {
      console.log(cartItemId, quantity);
      try {
        // Gửi PATCH request để cập nhật số lượng sản phẩm
        const response = await axios.patch(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/cart/${cartItemId}`, { quantity },{
          withCredentials: true
        }); // Thay URL với endpoint thực tế
        return response.data; // Giả sử API trả về giỏ hàng đã cập nhật
      } catch (error:unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return rejectWithValue(error.response.data);
        }
        return rejectWithValue({ message: 'An unknown error occurred' });
      }
    }
  );

  export const removeFromCartAPI = createAsyncThunk(
    'cart/removeFromCartAPI',
    async (cartItemId: string, { rejectWithValue }) => {
      try {
        // Gửi DELETE request để xóa sản phẩm khỏi giỏ hàng
        const response = await axios.delete(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/cart/${cartItemId}`, {
          withCredentials: true
        }); // Thay URL với endpoint thực tế
        return response.data; // Giả sử API trả về giỏ hàng đã cập nhật
      } catch (error:unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return rejectWithValue(error.response.data);
        }
        return rejectWithValue({ message: 'An unknown error occurred' });
      }
    }
  );


  export const updateSelectedOptionAPI = createAsyncThunk(
    'cart/updateSelectedOptionAPI',
      async ({ cartItemId, option_id }: { cartItemId: string; option_id?: string}, { rejectWithValue }) => {
      try {
        // Gửi PATCH request để cập nhật số lượng sản phẩm
        const response = await axios.patch(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/cart/${cartItemId}`, { option_id },{
          withCredentials: true
        }); // Thay URL với endpoint thực tế
        return response.data; // Giả sử API trả về giỏ hàng đã cập nhật
      } catch (error:unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return rejectWithValue(error.response.data);
        }
        return rejectWithValue({ message: 'An unknown error occurred' });
      }
    }
  );

 export const repurchaseOrderAPI = createAsyncThunk(
    'cart/repurchaseOrderAPI',
    async (order_id: string, { rejectWithValue }) => {
      try {
        // Gửi DELETE request để xóa sản phẩm khỏi giỏ hàng
        const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/cart/repurchase/${order_id}`,{}, {
          withCredentials: true
        }); // Thay URL với endpoint thực tế
        return response.data; // Giả sử API trả về giỏ hàng đã cập nhật
      } catch (error:unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return rejectWithValue(error.response.data);
        }
        return rejectWithValue({ message: 'An unknown error occurred' });
      }
    }
  ); 