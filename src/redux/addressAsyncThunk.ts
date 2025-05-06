import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import  {Address}  from './addressSlice';

export const addAddressAPI = createAsyncThunk(
    "addresses/addAddress",
    async (newAddress: Address, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/address`, newAddress,
          {
            withCredentials: true
          }
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  // Lấy danh sách địa chỉ từ API
  export const fetchAddresses = createAsyncThunk(
    "addresses/fetchAddresses",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/address`,
          {
            withCredentials: true
          }
        );
        return response.data;
        
      } catch (error : any) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  // Xóa địa chỉ
  export const deleteAddressAPI = createAsyncThunk(
    "addresses/deleteAddress",
    async (id: string, { rejectWithValue }) => {
      try {
        await axios.delete(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/address/${id}`,
          {
            withCredentials: true
          }
        );
        return id;
      } catch (error : any) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  // Cập nhật địa chỉ
  export const updateAddressAPI = createAsyncThunk(
    "addresses/updateAddress",
    async ({ id, updatedFields }: { id: string; updatedFields: any }, { rejectWithValue }) => {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_NODEJS_BACKEND_URL}/address/${id}`,
          updatedFields, // Truyền trực tiếp updatedFields
          {
            withCredentials: true
          }
        );
        return response.data;
      } catch (error : any) {
        return rejectWithValue(error.response?.data || "Lỗi không xác định");
      }
    }
  );

  export const getAddressById = createAsyncThunk(
    "addresses/getById",
    async (id: string, { rejectWithValue }) => {
      try {
        const response = await axios.get<Address>(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/address/${id}`,
          {
            withCredentials: true
          }
        );
        return response.data;
      } catch (error : any) {
        return rejectWithValue(error.response?.data || "Lỗi không xác định");
      }
    }
  );