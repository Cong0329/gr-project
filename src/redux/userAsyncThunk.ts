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

export const adminLoginAPI =  createAsyncThunk(
  "admin/loginAdmin",
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

