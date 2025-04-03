import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import  {Address}  from './addressSlice';

export const addAddressAPI = createAsyncThunk(
    "addresses/addAddress",
    async (newAddress: Address, { rejectWithValue }) => {
      try {
        const response = await axios.post("https://65e695fbd7f0758a76e897e1.mockapi.io/api/v1/address", newAddress);
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
        const response = await axios.get("https://65e695fbd7f0758a76e897e1.mockapi.io/api/v1/address");
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  // Xóa địa chỉ
  export const deleteAddressAPI = createAsyncThunk(
    "addresses/deleteAddress",
    async (id: string, { rejectWithValue }) => {
      try {
        await axios.delete(`https://65e695fbd7f0758a76e897e1.mockapi.io/api/v1/address/${id}`);
        return id;
      } catch (error) {
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
          `https://65e695fbd7f0758a76e897e1.mockapi.io/api/v1/address/${id}`,
          updatedFields // Truyền trực tiếp updatedFields
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi không xác định");
      }
    }
  );
  export const getAddressById = createAsyncThunk(
    "addresses/getById",
    async (id: string, { rejectWithValue }) => {
      try {
        const response = await axios.get<Address>(`https://65e695fbd7f0758a76e897e1.mockapi.io/api/v1/address/${id}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi không xác định");
      }
    }
  );