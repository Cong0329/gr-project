import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SignInForm } from "../components/admin/components/auth/SignInForm";

interface Profile {
    name : string | null;
    phone : string | null;
    gender : string | null;
}



export const updateProfileAPI = createAsyncThunk(
    "profile/updateProfile",
    async (newProfile: Profile, { rejectWithValue }) => {
      try {
        const response = await axios.put(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/user/me`, newProfile,
          { withCredentials: true }
        );
        return response.data;
      } catch (error : any) {
        return rejectWithValue(error.response.data);
      }
    }
  );

export const adminLoginAPI = createAsyncThunk(
  "admin/loginAdmin",
  async (formLogin: SignInForm, { rejectWithValue }) => {
    try {
      console.log("Calling login API with data:", formLogin);
      console.log("API URL:", `${import.meta.env.VITE_NODEJS_BACKEND_URL}/auth/login`);
      
      const response = await axios.post(
        `${import.meta.env.VITE_NODEJS_BACKEND_URL}/auth/login`, 
        formLogin,
        { withCredentials: true }
      );
      
      console.log("API response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("API error:", error);
      console.error("Response data:", error.response?.data);
      console.error("Status code:", error.response?.status);
      return rejectWithValue(error.response?.data || { message: "Không thể kết nối đến máy chủ" });
    }
  }
);

export const vefifyEmailAPI = createAsyncThunk(
  "verify/verify-email",
  async ({email, verifyCode}: {email: string, verifyCode: string}, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/auth/verify-email`, { email, verifyCode },
        {
          withCredentials: true
        }
      )
      return response.data;
    } catch (error : any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const doctorLoginAPI =  createAsyncThunk(
  "doctor/loginDoctor",
  async (formLogin:SignInForm, { rejectWithValue  }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/auth/login`, formLogin,
        { withCredentials: true }
      );
      return response.data;
    } catch (error : any) {
      return rejectWithValue(error.response.data);
    }
  }
) ;


export const logoutApi = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/auth/logout`, {
        withCredentials: true
      });
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
