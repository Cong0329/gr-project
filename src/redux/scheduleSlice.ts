// // scheduleSlice.js
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';

// const API_URL = 'http://localhost:3000/api/v1/schedule';

// // Khởi tạo state ban đầu
// const initialState = {
//   schedules: [],
//   doctorSchedules: [],
//   scheduleDetail: null,
//   appointments: [],
//   loading: false,
//   error: null,
//   pagination: {
//     page: 1,
//     limit: 10,
//     total: 0
//   }
// };

// export const fetchSchedules = createAsyncThunk(
//   'schedules/fetchSchedules',
//   async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
//     try {
//       const params = new URLSearchParams({
//         page,
//         limit,
//         ...filters
//       }).toString();
      
//       const response = await axios.get(`${API_URL}?${params}`);
//       return {
//         data: response.data,
//         pagination: {
//           page,
//           limit,
//           total: response.headers['x-total-count'] || 0
//         }
//       };
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const fetchSchedulesByType = createAsyncThunk(
//   'schedules/fetchByType',
//   async (type, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_URL}/${type}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const fetchDoctorSchedules = createAsyncThunk(
//   'schedules/fetchDoctorSchedules',
//   async ({ doctorId, params = {} }, { rejectWithValue }) => {
//     try {
//       const queryString = new URLSearchParams(params).toString();
//       const response = await axios.get(`${API_URL}/doctor/${doctorId}?${queryString}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const fetchScheduleDetail = createAsyncThunk(
//   'schedules/fetchDetail',
//   async (scheduleId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_URL}/${scheduleId}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const createSchedule = createAsyncThunk(
//   'schedules/create',
//   async (scheduleData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(API_URL, scheduleData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const updateSchedule = createAsyncThunk(
//   'schedules/update',
//   async ({ id, updateData }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(`${API_URL}/${id}`, updateData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const deleteSchedule = createAsyncThunk(
//   'schedules/delete',
//   async (scheduleId, { rejectWithValue }) => {
//     try {
//       await axios.delete(`${API_URL}/${scheduleId}`);
//       return scheduleId;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const createAppointment = createAsyncThunk(
//   'schedules/createAppointment',
//   async (appointmentData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${API_URL}/appointments`, appointmentData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const updateAppointmentStatus = createAsyncThunk(
//   'schedules/updateAppointment',
//   async ({ id, status }, { rejectWithValue }) => {
//     try {
//       const response = await axios.patch(`${API_URL}/appointments/${id}`, { status });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// const scheduleSlice = createSlice({
//   name: 'schedules',
//   initialState,
//   reducers: {
//     // ... các reducers khác
//   },
//   extraReducers: (builder) => {
//     // Đầu tiên xử lý tất cả các cases cụ thể
//     builder
//       .addCase(fetchSchedules.fulfilled, (state, action) => {
//         state.loading = false;
//         state.schedules = action.payload.data;
//         state.pagination = action.payload.pagination;
//       })
//       .addCase(fetchSchedulesByType.fulfilled, (state, action) => {
//         state.loading = false;
//         state.schedules = action.payload;
//       })
//       .addCase(fetchDoctorSchedules.fulfilled, (state, action) => {
//         state.loading = false;
//         state.doctorSchedules = action.payload;
//       })
//       .addCase(fetchScheduleDetail.fulfilled, (state, action) => {
//         state.loading = false;
//         state.scheduleDetail = action.payload;
//       })
//       .addCase(createSchedule.fulfilled, (state, action) => {
//         state.loading = false;
//         state.schedules.unshift(action.payload);
//       })
//       .addCase(updateSchedule.fulfilled, (state, action) => {
//         state.loading = false;
//         state.schedules = state.schedules.map(schedule => 
//           schedule.id === action.payload.id ? action.payload : schedule
//         );
//         if (state.scheduleDetail?.id === action.payload.id) {
//           state.scheduleDetail = action.payload;
//         }
//       })
//       .addCase(deleteSchedule.fulfilled, (state, action) => {
//         state.loading = false;
//         state.schedules = state.schedules.filter(
//           schedule => schedule.id !== action.payload
//         );
//       })
//       .addCase(createAppointment.fulfilled, (state, action) => {
//         state.loading = false;
//         state.appointments.push(action.payload);
//       })
//       .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
//         state.loading = false;
//         state.appointments = state.appointments.map(appt => 
//           appt.id === action.payload.id ? action.payload : appt
//         );
//       });

//     // Sau đó mới xử lý các matchers chung
//     builder
//       .addMatcher(
//         (action) => action.type.endsWith('/pending'),
//         (state) => {
//           state.loading = true;
//           state.error = null;
//         }
//       )
//       .addMatcher(
//         (action) => action.type.endsWith('/rejected'),
//         (state, action) => {
//           state.loading = false;
//           state.error = action.payload || action.error.message;
//         }
//       );
//   }
// });

// // Export actions và reducer
// export const { clearScheduleDetail, clearSchedules, resetScheduleState } = scheduleSlice.actions;
// export default scheduleSlice.reducer;
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1/schedule';

const initialState = {
  specialistSchedules: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  },
  currentType: 'specialty' // Thêm trạng thái để lưu loại hiện tại
};

// Async thunk để lấy lịch của bác sĩ theo type (specialty/online)
export const fetchSpecialistSchedules = createAsyncThunk(
  'schedules/fetchSpecialistSchedules',
  async ({ page = 1, limit = 10, type = 'specialty', filters = {} }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        type, // Thêm type vào query params
        ...filters
      }).toString();
      
      const response = await axios.get(`${API_URL}/specialist?${params}`);
      return {
        data: response.data,
        pagination: {
          page,
          limit,
          total: response.headers['x-total-count'] || response.data.length || 0
        },
        type // Trả về type để lưu vào state
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
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
    // Thêm reducer để thay đổi type nếu cần
    setSpecialistType: (state, action) => {
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
        state.currentType = action.payload.type; // Lưu type hiện tại
      })
      .addCase(fetchSpecialistSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch specialist schedules';
      });
  }
});

// Export actions
export const { 
  resetSpecialistSchedules,
  setSpecialistType 
} = scheduleSlice.actions;

export default scheduleSlice.reducer;