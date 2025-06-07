import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDepartments = createAsyncThunk("departments/fetch", async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_NODEJS_BACKEND_URL}/department`
  );
  return response.data;
});

export interface Department {
  id: number;
  name: string;
  image: string;
  price: string;
}

// Interface cho slice state
interface DepartmentState {
  departments: Department[];
  loading: boolean;
  error: string | null;
}

// Khởi tạo state với kiểu rõ ràng
const initialState: DepartmentState = {
  departments: [],
  loading: false,
  error: null,
};

const departmentSlice = createSlice({
  name: "departments",
  initialState,
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
        state.error = action.error.message || "Error fetching departments";
      });
  },
});

export default departmentSlice.reducer;
