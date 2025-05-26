import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDepartments = createAsyncThunk("departments/fetch", async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_NODEJS_BACKEND_URL}/department`
  );
  return response.data;
});

const departmentSlice = createSlice({
  name: "departments",
  initialState: {
    departments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default departmentSlice.reducer;
