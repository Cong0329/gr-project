import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBrands = createAsyncThunk(
  "product/brands",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/brand`, {
        withCredentials: true,
      });
      return res.data; // ✅ TRẢ VỀ ở đây
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateBrand = createAsyncThunk(
  "product/updateBrand",
  async (formData: FormData, { rejectWithValue }) => {
    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }
    try {
      const res = await axios.put(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/brand/${formData.get('id')}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data; // ✅ TRẢ VỀ ở đây
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createBrand = createAsyncThunk(
  "product/createBrand",
  async (formData: FormData, { rejectWithValue }) => {    
    try {
      const res = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/brand`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data; // ✅ TRẢ VỀ ở đây
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteBrand = createAsyncThunk(
  "product/deleteBrand",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/brand/${id}`, {
        withCredentials: true
      });
      return res.data; // ✅ TRẢ VỀ ở đây
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const getBrandProduct = createAsyncThunk(
    "product/getBrandProduct",
    async (name: string, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/brand/${name}`, {
                withCredentials: true
            });
            return res.data; // ✅ TRẢ VỀ ở đây
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
)
