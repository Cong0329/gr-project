import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const searchMedicine = createAsyncThunk(
    "medicine/search", async (name: string, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/product/search/${name}`);
            return res.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    });
