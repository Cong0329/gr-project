import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { OrderForm } from './orderSlice';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData: OrderForm, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_NODEJS_BACKEND_URL}/order`,
        orderData,
        { withCredentials: true }
      );

      const data = response.data;

      // Chuyển hướng (redirect) tùy thuộc vào loại thanh toán
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        window.location.href = '/profile/orders';
      }

      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);


export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/order/me`, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/order/${id}/me`, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  "order/fetchAdminOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/order/admin/all`, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);

export const fetchAdminOrderById = createAsyncThunk(
  "order/fetchAdminOrderById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/order/${id}/admin`, {
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);


export const updateOrderConfirm = createAsyncThunk(
  "order/updateOrderConfirm",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/order/${id}/admin/confirm`, {}, {
        withCredentials: true
      });
      const data = response.data;
      if (data.order.status === 'confirmed') {
        window.location.href = '/admin/orders';
      }
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);

export const updateOrderShipping = createAsyncThunk(
  "order/updateOrderShipping",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/order/${id}/admin/shipping`, {}, {
        withCredentials: true
      });
      const data = response.data;
      if (data.order.status === 'shipping') {
        window.location.href = '/admin/orders';
      }
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);

export const updateOrderCompleted = createAsyncThunk(
  "order/updateOrderCompleted",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/order/${id}/completed`, {}, {
        withCredentials: true
      });
      const data = response.data;
      if (data.order.status === 'completed') {
        window.location.href = '/profile/orders';
      }
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);

export const updateOrderCancelled = createAsyncThunk(
  "order/updateOrderCancelled",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/order/${id}/cancel`, {}, {
        withCredentials: true
      });
      const data = response.data;
      if (data.order.status === 'cancelled') {
        window.location.href = '/profile/orders';
      }
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);  