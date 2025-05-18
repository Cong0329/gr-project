import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMedicalObjects = createAsyncThunk(
    'medicalObject/fetchMedicalObjects',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/medical-object`);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createMedicalObject = createAsyncThunk(
    "medicalObject/createMedicalObject",
    async (name: string, { rejectWithValue }) => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/medical-object`, { name }, {
          withCredentials: true,
        });
        return res.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );

export const updateMedicalObject = createAsyncThunk(
    "medicalObject/updateMedicalObject",
    async ({id, name} : {id: number, name: string}, { rejectWithValue }) => {
      try {
        const res = await axios.put(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/medical-object/${id}`, {name}, {
          withCredentials: true,
        });
        return res.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );

export const deleteMedicalObject = createAsyncThunk(
    "medicalObject/deleteMedicalObject",
    async (id: number, { rejectWithValue }) => {
      try {
        const res = await axios.delete(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/medical-object/${id}`, {
          withCredentials: true,
        });
        return res.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );

export const getMedicalObjectProductByName = createAsyncThunk(
    "medicalObject/getMedicalObjectProductByName",
    async (name: string, { rejectWithValue }) => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/medical-object/${name}`, {
          withCredentials: true,
        });
        return res.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );