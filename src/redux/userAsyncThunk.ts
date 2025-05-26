import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SignInForm } from "../components/admin/components/auth/SignInForm";

interface Profile {
    name : string | null;
    phone : string | null;
    gender : string | null;
    password : string | null; 
    avatar : File | null;
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

export const updateProfileAdminAPI = createAsyncThunk(
    "profile/updateProfileAdmin",
    async (newProfile: FormData, { rejectWithValue }) => {
      try {
        const response = await axios.put(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/user/admin/me`, newProfile,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
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
  "admin/verify",
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

export const fetchUsersAPI = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/user/users`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error : any) {
      return rejectWithValue(error.response.data);
    }
  }
);