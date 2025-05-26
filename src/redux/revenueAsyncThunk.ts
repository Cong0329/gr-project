import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserRevenue = createAsyncThunk("userRevenue/fetch", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/user/stats/growth`, {
            withCredentials: true
        });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data);
        }
        return rejectWithValue({ message: 'An unknown error occurred' });
    }
})

export const fetchOrderRevenue = createAsyncThunk("orderRevenue/fetch", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/order/stats/monthly-revenue`, {
            withCredentials: true
        });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data);
        }
        return rejectWithValue({ message: 'An unknown error occurred' });
    }
})

export const fetchTarget = createAsyncThunk("target/fetch", async (date: string, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/order/stats/revenue?date=${date}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data);
        }
        return rejectWithValue({ message: 'An unknown error occurred' });
    }
})

export const fetchMonthlyTarget = createAsyncThunk("monthlyTarget/fetch", async (month: string, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/order/stats/revenue?month=${month}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data);
        }
        return rejectWithValue({ message: 'An unknown error occurred' });
    }
})