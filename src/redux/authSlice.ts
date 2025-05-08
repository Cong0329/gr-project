import { createSlice } from "@reduxjs/toolkit";
import { adminLoginAPI, updateProfileAPI, vefifyEmailAPI } from "./userAsyncThunk";
import { tr } from "date-fns/locale";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  phone: string;
  gender: string;
}

interface AuthState {
  isUserAuthenticated: boolean;
  isAuthenticated: boolean;
  user: UserInfo;
  admin: UserInfo;
  verify: boolean;
  message: string;
  mail: string;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: AuthState = {
  isUserAuthenticated: false,
  isAuthenticated: false,
  user: {} as UserInfo,
  admin: {} as UserInfo,
  verify: false,
  message: '',
  mail:'',
  status: "idle"
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      setChatId: (state, action) => {
        state.chat_id = action.payload;
      },
      googleLogin: (state, actions) => {
        state.isUserAuthenticated = true;
        state.user = actions.payload;
      },
      login: (state) => {
        state.verify = true;
      },
      reset: (state) => {
        state.isAuthenticated = false;
        state.isUserAuthenticated = false;
      },
      vefify: (state) => {
        state.isAuthenticated = true;
        state.verify = false;
      },
      lockVerify: (state) => {
        state.verify = false;
      },
      logout: (state) => {
        state.isAuthenticated = false;
        state.isUserAuthenticated = false;
        state.user = {} as UserInfo;
        state.admin = {} as UserInfo;
        localStorage.clear();
      },
      adminLogin: (state, action) => {
        state.admin = action.payload;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(updateProfileAPI.fulfilled, (state, action) => {
          state.user = action.payload.user;
        })
        .addCase(adminLoginAPI.fulfilled, (state, action) => {
          state.status = "succeeded"
          state.verify = true;
          state.mail = action.payload.email;
        })
        .addCase(adminLoginAPI.pending, (state) => {
          state.isAuthenticated = false;
          state.status = "loading";
        })
        .addCase(adminLoginAPI.rejected, (state, action) => {
          state.status = "failed";
          state.verify = false;
          state.message = action.payload.message;
        })
        .addCase(vefifyEmailAPI.fulfilled, (state) => {
          state.status = "succeeded";
          state.verify = false;
          state.isAuthenticated = true;
        })
        .addCase(vefifyEmailAPI.pending, (state) => {
          state.status = "loading";
        })
        .addCase(vefifyEmailAPI.rejected, (state, action) => {
          state.message = action.payload.message;
        })
    },
  });


  export const { login, logout, googleLogin, vefify, lockVerify, reset, adminLogin} = authSlice.actions;
  export default authSlice.reducer;