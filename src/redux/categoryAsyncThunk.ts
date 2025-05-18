import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCategories = createAsyncThunk(
  "product/categories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/category`, {
        withCredentials: true,
      });
      return res.data; // ✅ TRẢ VỀ ở đây
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getParentCategory = createAsyncThunk(
  "product/getParentCategory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/category/parent`, {
        withCredentials: true,
      });
      return res.data; // ✅ TRẢ VỀ ở đây
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createCategory = createAsyncThunk(
  "product/createCategories",
  async({name, parent_id}: {name: string, parent_id?: string} , {rejectWithValue}) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/category`, {name, parent_id}, {
        withCredentials: true
      })
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "product/updateCategories",
  async({id, name, parent_id }: {id: string, name: string, parent_id?: string}, {rejectWithValue}) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/category/${id}`, {name, parent_id}, {
        withCredentials: true
      })
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCategory = createAsyncThunk (
  "product/deleteCategory",
  async(id: number, {rejectWithValue}) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/category/${id}`, {
        withCredentials: true
      })
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const getCategoryProduct = createAsyncThunk(
  "product/getCategoryProduct",
  async(name: string, {rejectWithValue}) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/category/${name}`, {
        withCredentials: true
      })
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)