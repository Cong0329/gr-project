import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const sendMessageUser = createAsyncThunk(
    "message/sendMessageUser",
    async ({ content, image }: { content?: string; image?: File }, { rejectWithValue }) => {
        try {
            console.log('send')
            if (!content && !image) {
                return rejectWithValue({ message: "Bạn phải nhập nội dung hoặc chọn ảnh." });
            }

            const formData = new FormData();
            if (content) formData.append("content", content);
            if (image) formData.append("image", image);

            const response = await axios.post(
                `${import.meta.env.VITE_NODEJS_BACKEND_URL}/message/user`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: "Đã có lỗi xảy ra." });
        }
    }
);



export const sendMessageDoctor = createAsyncThunk(
    "message/sendMessageDoctor",
    async ({ content, image, recipientId ,id }: { content?: string; image?: File, recipientId: string ,id: string}, { rejectWithValue }) => {
        try {
            console.log('send')
            if (!content && !image) {
                return rejectWithValue({ message: "Bạn phải nhập nội dung hoặc chọn ảnh." });
            }

            const formData = new FormData();
            if (content) formData.append("content", content);
            if (image) formData.append("image", image);
            formData.append("recipientId", recipientId);

            const response = await axios.post(
                `${import.meta.env.VITE_NODEJS_BACKEND_URL}/message/${id}/doctor`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: "Đã có lỗi xảy ra." });
        }
    }
);

export const sendAIMessage = createAsyncThunk(
    "message/sendAIMessage",
    async ({ content }: { content: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_NODEJS_BACKEND_URL}/message/ai/user`,
                { content },
                {
                    withCredentials: true
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
);


export const sendMessageAdmin = createAsyncThunk(
    "message/sendMessageAdmin",
    async ({ content, recipientId }: { content: string, recipientId: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_NODEJS_BACKEND_URL}/message/admin`,
                { content, recipientId },
                {
                    withCredentials: true
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
);

export const fetchMessagesUser = createAsyncThunk(
    "message/fetchMessagesUser",
    async ({ id }: { id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_NODEJS_BACKEND_URL}/message/${id}/user`,
                {
                    withCredentials: true
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
);

export const fetchMessagesAdmin = createAsyncThunk(
    "message/fetchMessagesAdmin",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_NODEJS_BACKEND_URL}/message/${id}/admin`,
                {
                    withCredentials: true
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
);


export const getAllMessagesAdmin = createAsyncThunk(
    "message/getAllMessagesAdmin",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_NODEJS_BACKEND_URL}/message/all`,
                {
                    withCredentials: true
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
);

export const getAllMessageUser = createAsyncThunk(
    "message/getAllMessageUser",
    async ({ id }: { id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_NODEJS_BACKEND_URL}/message/${id}/doctor`,
                {
                    withCredentials: true
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)

export const hidenMessage = createAsyncThunk(
    "message/hidenMessage",
    async ({ id }: { id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_NODEJS_BACKEND_URL}/message/hiden/${id}/admin`,
                {
                    withCredentials: true
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
);

export const unlockedMessages = createAsyncThunk(
    "message/unlockedMessages",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_NODEJS_BACKEND_URL}/message/unlock/${id}/admin`, {},
                {
                    withCredentials: true
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
);
