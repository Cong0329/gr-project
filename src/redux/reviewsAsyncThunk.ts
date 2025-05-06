import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createReview = createAsyncThunk(
    "reviews/createReview", async ({ productId, rating, comment }: { productId: string, rating: number, comment: string }, { rejectWithValue }) => {
        console.log(productId, rating, comment);
        try {
            const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/review`, { productId, rating, comment }, {
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

export const getPendingReviews = createAsyncThunk(
    "reviews/getPendingReviews", async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/review/pending`, {
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
)

export const getReviews = createAsyncThunk(
    "reviews/getReviews", async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/review`, {
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
)

export const replyReview = createAsyncThunk(
    "reviews/replyReview", async ({ id, reply }: { id: string, reply: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/review/${id}/reply`, { reply }, {
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
)

export const upadateReplyReview = createAsyncThunk(
    "reviews/upadateReplyReview", async ({ replyId, reply }: { replyId: string, reply: string }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/review/reply/${replyId}`, { reply }, {
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
)