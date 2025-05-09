import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:3000/api/v1';

// Async thunks
export const requestDoctorAssignment = createAsyncThunk(
  'doctorAssignment/requestDoctorAssignment',
  async ({ booking_request_id, doctor_id, notes }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/doctor-assignment/request`, {
        booking_request_id,
        doctor_id,
        notes
      });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi yêu cầu bác sĩ');
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi' });
    }
  }
);

export const updateDoctorAssignment = createAsyncThunk(
  'doctorAssignment/updateDoctorAssignment',
  async ({ id, status, notes }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/doctor-assignment/${id}`, {
        status,
        notes
      });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật yêu cầu');
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi' });
    }
  }
);

export const getAssignmentsByBookingRequest = createAsyncThunk(
  'doctorAssignment/getAssignmentsByBookingRequest',
  async ({ booking_request_id, status }, { rejectWithValue }) => {
    try {
      const url = `${API_URL}/doctor-assignment/booking/${booking_request_id}`;
      const queryParams = status ? `?status=${status}` : '';
      const response = await axios.get(url + queryParams);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách yêu cầu');
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi' });
    }
  }
);

export const getAssignmentsByDoctor = createAsyncThunk(
  'doctorAssignment/getAssignmentsByDoctor',
  async ({ doctor_id, status, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      let url = `${API_URL}/doctor-assignment/doctor/${doctor_id}?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách yêu cầu');
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi' });
    }
  }
);

export const getAssignmentById = createAsyncThunk(
  'doctorAssignment/getAssignmentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/doctor-assignment/${id}`);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi lấy chi tiết yêu cầu');
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi' });
    }
  }
);

export const approveDoctorAndCreateSchedule = createAsyncThunk(
  'doctorAssignment/approveDoctorAndCreateSchedule',
  async ({ booking_request_id, doctor_id }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/doctor-assignment/approve-doctor`, {
        booking_request_id,
        doctor_id
      });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi phê duyệt bác sĩ');
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi' });
    }
  }
);

export const getBookingRequestWithAssignments = createAsyncThunk(
  'doctorAssignment/getBookingRequestWithAssignments',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/doctor-assignment/booking-detail/${id}`);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi lấy thông tin chi tiết');
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi' });
    }
  }
);

// Initial state
const initialState = {
  loading: false,
  error: null,
  assignmentsByBooking: [],
  assignmentsByDoctor: {
    doctorAssignments: [],
    total: 0,
    total_pages: 0,
    current_page: 1
  },
  currentAssignment: null,
  bookingRequestDetail: null,
  createdAssignment: null,
  updatedSchedule: null
};

// Slice
const doctorAssignmentSlice = createSlice({
  name: 'doctorAssignment',
  initialState,
  reducers: {
    clearDoctorAssignmentErrors: (state) => {
      state.error = null;
    },
    clearCreatedAssignment: (state) => {
      state.createdAssignment = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Request Doctor Assignment
      .addCase(requestDoctorAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestDoctorAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.createdAssignment = action.payload.doctorAssignment;
        // Nếu đã có assignments cho booking này, thêm vào mảng
        if (state.assignmentsByBooking.length > 0) {
          state.assignmentsByBooking.push(action.payload.doctorAssignment);
        }
      })
      .addCase(requestDoctorAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Doctor Assignment
      .addCase(updateDoctorAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctorAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAssignment = action.payload.doctorAssignment;
        
        // Cập nhật trong danh sách nếu có
        if (state.assignmentsByBooking.length > 0) {
          const index = state.assignmentsByBooking.findIndex(item => item.id === action.payload.doctorAssignment.id);
          if (index !== -1) {
            state.assignmentsByBooking[index] = action.payload.doctorAssignment;
          }
        }
        
        if (state.assignmentsByDoctor.doctorAssignments.length > 0) {
          const index = state.assignmentsByDoctor.doctorAssignments.findIndex(
            item => item.id === action.payload.doctorAssignment.id
          );
          if (index !== -1) {
            state.assignmentsByDoctor.doctorAssignments[index] = action.payload.doctorAssignment;
          }
        }
      })
      .addCase(updateDoctorAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Assignments By Booking Request
      .addCase(getAssignmentsByBookingRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAssignmentsByBookingRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.assignmentsByBooking = action.payload;
      })
      .addCase(getAssignmentsByBookingRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Assignments By Doctor
      .addCase(getAssignmentsByDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAssignmentsByDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.assignmentsByDoctor = action.payload;
      })
      .addCase(getAssignmentsByDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Assignment By Id
      .addCase(getAssignmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAssignmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAssignment = action.payload;
      })
      .addCase(getAssignmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Approve Doctor And Create Schedule
      .addCase(approveDoctorAndCreateSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveDoctorAndCreateSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedSchedule = action.payload.schedule;
        state.bookingRequestDetail = action.payload.bookingRequest;
        
        // Cập nhật trạng thái các assignments nếu đang có danh sách
        if (state.assignmentsByBooking.length > 0) {
          state.assignmentsByBooking = state.assignmentsByBooking.map(assignment => {
            if (assignment.doctor_id === action.payload.schedule.doctor_id) {
              return { ...assignment, status: 'approved' };
            } else if (assignment.status === 'requested') {
              return { ...assignment, status: 'rejected' };
            }
            return assignment;
          });
        }
      })
      .addCase(approveDoctorAndCreateSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Booking Request With Assignments
      .addCase(getBookingRequestWithAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingRequestWithAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingRequestDetail = action.payload;
        // Cập nhật danh sách assignments từ booking detail
        if (action.payload.doctorAssignments) {
          state.assignmentsByBooking = action.payload.doctorAssignments;
        }
      })
      .addCase(getBookingRequestWithAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearDoctorAssignmentErrors, clearCreatedAssignment } = doctorAssignmentSlice.actions;

export default doctorAssignmentSlice.reducer;