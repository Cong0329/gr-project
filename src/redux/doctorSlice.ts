import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Doctor {
  id: string;
  name: string;
  avatar?: string;
  type: 'specialty' | 'online';
  experience?: string;
  position?: string;
  patientAge?: string;
  location?: string;
  clinic?: string;
  address?: string;
  department_id: number;
  department?: {
    id: number;
    name: string;
    description?: string;
  };
  schedules?: Array<{
    id: string;
    date: string;
    start_time: string;
    end_time: string;
    type: 'specialist' | 'specialist_online';
    status: 'available' | 'booked';
  }>;
}

interface DoctorState {
  doctors: Doctor[];
  info: null,
  loading: boolean;
  error: string | null;
  currentDoctor: Doctor | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  filters: {
    type?: 'specialty' | 'online';
    department_id?: number;
    search?: string;
  };
}

const initialState: DoctorState = {
  doctors: [],
  info: null,
  loading: false,
  error: null,
  currentDoctor: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {},
};

export const fetchDoctors = createAsyncThunk("doctors/fetch", async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_NODEJS_BACKEND_URL}/doctor`
  );
  return response.data;
});

export const fetchDoctorById = createAsyncThunk(
  "doctors/fetchById",
  async (doctorId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_NODEJS_BACKEND_URL}/doctor/${doctorId}`,
        {
          withCredentials: true
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể lấy thông tin bác sĩ"
      );
    }
  }
);

export const fetchMyDoctorInfo = createAsyncThunk(
  'doctor/fetchMyDoctorInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_NODEJS_BACKEND_URL}/doctor/info/me`,
        { withCredentials: true }
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Failed to fetch doctor info');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('API Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Network error');
    }
  }
);


const doctorSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<DoctorState['filters']>) => {
      state.filters = action.payload;
      state.pagination.page = 1;
    },
    resetCurrentDoctor: (state) => {
      state.currentDoctor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDoctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyDoctorInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyDoctorInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload;
      })
      .addCase(fetchMyDoctorInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, resetCurrentDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;