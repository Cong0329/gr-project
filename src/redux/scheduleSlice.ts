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
  mySchedules: Schedule[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  currentType: 'specialist' | 'specialist_online';
  isConfirming: boolean;
  confirmError: string | null;
  doctorInfo: any;
  isCreating: boolean;
  createError: string | null;
  message: '',
}

const initialState: ScheduleState = {
  specialistSchedules: [],
  mySchedules: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  },
  currentType: 'specialist',
  isCreating: false,
  createError: null,
  message: '',
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

export const fetchMyDoctorSchedules = createAsyncThunk(
  'schedules/fetchMyDoctorSchedules',
  async (
    { page = 1, limit = 10, status, date_from, date_to, type }: 
    { 
      page?: number; 
      limit?: number; 
      status?: string;
      date_from?: string;
      date_to?: string;
      type?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const params = {
        page,
        limit,
        ...(status && { status }),
        ...(date_from && { date_from }),
        ...(date_to && { date_to }),
        ...(type && { type })
      };

      const response = await axios.get(
        `${import.meta.env.VITE_NODEJS_BACKEND_URL}/schedule/doctor/me`, 
        { 
          params,
          withCredentials: true 
        }
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Failed to fetch schedules');
      }

      return {
        data: response.data.data,
        pagination: response.data.pagination,
        doctor: response.data.doctor
      };
    } catch (error: any) {
      console.error('API Error:', error);
      
      if (error.response?.status === 403 && error.response?.data?.message === 'jwt expired') {
        return rejectWithValue('Session expired. Please login again.');
      }
      
      return rejectWithValue(error.response?.data?.message || error.message || 'Network error');
    }
  }
);

export const createSchedule = createAsyncThunk(
  'schedules/createSchedule',
  async (
    scheduleData: {
      date: string;
      start_time: string;
      end_time: string;
      type: 'specialist' | 'specialist_online';
      status?: 'available' | 'booked';
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_NODEJS_BACKEND_URL}/schedule`,
        scheduleData,
        { withCredentials: true }
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Failed to create schedule');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Create Schedule Error:', error);
      
      if (error.response?.status === 403) {
        return rejectWithValue('Not authorized to create schedule');
      }
      
      if (error.response?.status === 400) {
        return rejectWithValue(error.response.data.message || 'Invalid schedule data');
      }

      return rejectWithValue(error.response?.data?.message || error.message || 'Network error');
    }
  }
);

export const updateSchedule = createAsyncThunk(
  'schedules/updateSchedule',
  async ({ scheduleId, updateData  }, { rejectWithValue }) => {
    try {
      const url = `${import.meta.env.VITE_NODEJS_BACKEND_URL}/schedule/my-schedule/update/${scheduleId}`;
      console.log('Calling URL:', url);
      console.log('Update data:', updateData);
      
      const response = await axios.put(url, updateData, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.log('Error details:', error.response);
      return rejectWithValue(error.response.data);
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
      .addCase(fetchMyDoctorSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyDoctorSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.mySchedules = action.payload.data;
        state.pagination = action.payload.pagination;
        state.doctorInfo = action.payload.doctor;
      })
      .addCase(fetchMyDoctorSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch my schedules';
      })
      .addCase(createSchedule.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.isCreating = false;
        state.mySchedules.unshift(action.payload);
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload as string;
      })
      .addCase(updateSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        console.log('updateSchedule.fulfilled triggered'); // Thêm log này
        console.log('Payload:', action.payload); // Check payload
        
        state.loading = false;
        const updatedSchedule = action.payload.data; // Có thể lỗi ở đây
        console.log('Updated schedule:', updatedSchedule);
        
        const index = state.mySchedules.findIndex(s => s.id === updatedSchedule.id);
        console.log('Found index:', index);
        
        if (index !== -1) {
          state.mySchedules[index] = updatedSchedule;
        }
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Có lỗi xảy ra';
      })
  }
});

export const { 
  resetSpecialistSchedules,
  setSpecialistType 
} = scheduleSlice.actions;

export default scheduleSlice.reducer;