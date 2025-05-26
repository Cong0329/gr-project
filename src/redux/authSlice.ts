import { createSlice } from "@reduxjs/toolkit";
import { adminLoginAPI, fetchUsersAPI, updateProfileAdminAPI, updateProfileAPI, vefifyEmailAPI, doctorLoginAPI, deleteUserAPI, createUserAPI, } from "./userAsyncThunk";


const getSafeErrorMessage = (payload) => {
  if (!payload) return "Đã xảy ra lỗi";
  if (typeof payload === 'string') return payload;
  if (payload.message) return payload.message;
  return "Lỗi không xác định";
};

interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  phone: string;
  gender: string;
  roles: Role[];
}

interface Role {
  id: string;
  name: string;
  code: string;
}

interface AuthState {
  isUserAuthenticated: boolean;
  isAuthenticated: boolean;
  user: UserInfo;
  admin: UserInfo;
  users: UserInfo[];
  doctor: UserInfo;
  verify: boolean;
  role: string;
  message: string;
  
  mail: string;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: AuthState = {
  isUserAuthenticated: false,
  isAuthenticated: false,
  user: {} as UserInfo,
  admin: {} as UserInfo,
  users: [] as UserInfo[],
  doctor: {} as UserInfo,
  verify: false,
  role: '',
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
        state.status = "idle";
        state.role = '';
      },
      vefify: (state) => {
        state.isAuthenticated = true;
        state.verify = false;
      },
      lockVerify: (state) => {
        state.verify = false;
      },
      refreshRole : (state, action) => {
        state.role = action.payload;
      },
      logout: (state) => {
        state.isAuthenticated = false;
        state.isUserAuthenticated = false;
        state.user = {} as UserInfo;
        state.admin = {} as UserInfo;
        state.doctor = {} as UserInfo;
        state.status = "idle";
        localStorage.clear();
      },
      resetLoginStatus: (state) => {
        state.status = "idle";
        state.message = "";
      },
      adminLogin: (state, action) => {
        state.admin = action.payload;
      },
      doctorLogin: (state, action) => {
        state.doctor = action.payload;
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
          state.message = getSafeErrorMessage(action.payload);
        })

        .addCase(doctorLoginAPI.fulfilled, (state, action) => {
          state.status = "succeeded"
          state.verify = true;
          state.mail = action.payload.email;
        })
        .addCase(doctorLoginAPI.pending, (state) => {
          state.isAuthenticated = false;
          state.status = "loading";
        })
        .addCase(doctorLoginAPI.rejected, (state, action) => {
          state.status = "failed";
          state.verify = false;
          state.message = getSafeErrorMessage(action.payload);
        })
        .addCase(vefifyEmailAPI.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.verify = false;
          state.isAuthenticated = true;
          state.role = action.payload.roles;
        })
        .addCase(vefifyEmailAPI.pending, (state) => {
          state.status = "loading";
        })
        .addCase(vefifyEmailAPI.rejected, (state, action) => {
          state.status = "failed";
          state.message = getSafeErrorMessage(action.payload);
        })
        
        .addCase(updateProfileAdminAPI.fulfilled, (state) => {
          state.status = "succeeded";
        })
        .addCase(updateProfileAdminAPI.pending, (state) => {
          state.status = "loading";
        })
        .addCase(updateProfileAdminAPI.rejected, (state, action) => {
          state.message = action.payload.message;
        })
        .addCase(fetchUsersAPI.fulfilled, (state, action) => {
          state.users = action.payload.users;
          state.status = "idle";
        })
        .addCase(fetchUsersAPI.pending, (state) => {
          state.status = "loading";
        })
        .addCase(fetchUsersAPI.rejected, (state, action) => {
          state.message = action.payload.message;
          state.status = "failed";
        })
        .addCase(deleteUserAPI.fulfilled, (state) => {
          state.status = "succeeded";
        })
        .addCase(deleteUserAPI.pending, (state) => {
          state.status = "loading";
        })
        .addCase(deleteUserAPI.rejected, (state, action) => {
          state.message = action.payload.message;
          state.status = "failed";
        })
        .addCase(createUserAPI.fulfilled, (state) => {
          state.status = "succeeded";
        })
        .addCase(createUserAPI.pending, (state) => {
          state.status = "loading";
        })
        .addCase(createUserAPI.rejected, (state, action) => {
          state.message = action.payload.message;
          state.status = "failed";
        })
    },
  });


  export const { login, logout, googleLogin,resetLoginStatus , vefify, lockVerify, reset, adminLogin, refreshRole} = authSlice.actions;
  export default authSlice.reducer;