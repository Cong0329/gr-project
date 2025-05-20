import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface GoogleLoginPayload {
  credential: string; // Google ID token
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async ({ credential }: GoogleLoginPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(`${import.meta.env.VITE_BACKEND_URL}/auth/google`, {
        credential,
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Đăng nhập Google thất bại');
    }
  }
);
