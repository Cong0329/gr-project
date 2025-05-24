import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Schedule {
  id: string;
  doctor_id: string;
  date: string;
  start_time: string;
  end_time: string;
  type: 'specialist' | 'specialist_online';
  status: 'available' | 'booked';
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

interface ScheduleState {
  specialistSchedules: Schedule[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  currentType: 'specialist' | 'specialist_online';
  isConfirming: boolean;
  confirmError: string | null;
}

const initialState: ScheduleState = {
  specialistSchedules: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  },
  currentType: 'specialist',
};

export const fetchSpecialistSchedules = createAsyncThunk(
  'schedules/fetchSpecialistSchedules',
  async (
    { page = 1, limit = 10, type, date, service_id }: 
    { page?: number; limit?: number; type: string; date?: string; service_id?: string },
    { rejectWithValue }
  ) => {
    try {
      const params = {
        page,
        limit,
        type,
        ...(date && { date }),
        ...(service_id && { service_id })
      };

      const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/schedule/specialist`, { params });

      // Đảm bảo cấu trúc response thống nhất với backend
      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Failed to fetch schedules');
      }

      return {
        data: response.data.data,
        pagination: {
          page,
          limit,
          total: response.data.pagination?.total || response.data.data.length
        },
        type
      };
    } catch (error: any) {
      console.error('API Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Network error');
    }
  }
);

const scheduleSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    resetSpecialistSchedules: (state) => {
      state.specialistSchedules = [];
      state.pagination = initialState.pagination;
    },
    setSpecialistType: (state, action: PayloadAction<'specialist' | 'specialist_online'>) => {
      state.currentType = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecialistSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecialistSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.specialistSchedules = action.payload.data;
        state.pagination = action.payload.pagination;
        state.currentType = action.payload.type;
      })
      .addCase(fetchSpecialistSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch schedules';
      })
  }
});

export const { 
  resetSpecialistSchedules,
  setSpecialistType 
} = scheduleSlice.actions;

export default scheduleSlice.reducer;