import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const fetchIndications = createAsyncThunk(
  "product/indications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/indication`, {
        withCredentials: true,
      });
      return res.data; // ✅ TRẢ VỀ ở đây
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateIndication = createAsyncThunk(
  "product/updateIndication",
  async({id, name }: {id: number, name: string}, {rejectWithValue}) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/indication/${id}`, {name}, {
        withCredentials: true
      })
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createIndication = createAsyncThunk(
  "product/createIndication",
  async(name: string , {rejectWithValue}) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/indication`, {name}, {
        withCredentials: true
      })
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteIndication = createAsyncThunk(
  "product/deleteIndication",
  async(id: number, {rejectWithValue}) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/indication/${id}`, {
        withCredentials: true
      })
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const getIndicationProductByName = createAsyncThunk(
  "product/getIndicationByName",
  async(name: string, {rejectWithValue}) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/indication/${name}`, {
        withCredentials: true
      })
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)