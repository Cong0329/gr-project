import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Async thunks
export const requestDoctorAssignment = createAsyncThunk(
  'doctorAssignment/requestDoctorAssignment',
  async ({ booking_request_id, doctor_id, notes }: { booking_request_id: number; doctor_id?: string; notes: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/doctor-assignment/request`, {
        booking_request_id,
        doctor_id,
        notes
      }, {
        withCredentials: true
      });
      toast.success(response.data.message);
      return response.data;
    } catch (error:any) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi yêu cầu bác sĩ');
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi' });
    }
  }
);

export const updateDoctorAssignment = createAsyncThunk(
  'doctorAssignment/updateDoctorAssignment',
  async ({ id, status, notes }: { id: number; status: string; notes: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/doctor-assignment/${id}`, {
        status,
        notes
      });
      toast.success(response.data.message);
      return response.data;
    } catch (error:any) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật yêu cầu');
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi' });
    }
  }
);

export const getAssignmentsByBookingRequest = createAsyncThunk(
  'doctorAssignment/getAssignmentsByBookingRequest',
  async ({ booking_request_id, status }: { booking_request_id: number; status?: string }, { rejectWithValue }) => {
    try {
      const url = `${import.meta.env.VITE_NODEJS_BACKEND_URL}/doctor-assignment/booking/${booking_request_id}`;
      const queryParams = status ? `?status=${status}` : '';
      const response = await axios.get(url + queryParams);
      return response.data;
    } catch (error:any) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách yêu cầu');
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi' });
    }
  }
);

export const getAssignmentsByDoctor = createAsyncThunk(
  'doctorAssignment/getAssignmentsByDoctor',
  async ({ doctor_id, status, page = 1, limit = 10 }: { doctor_id: string; status?: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      let url =`${import.meta.env.VITE_NODEJS_BACKEND_URL}/doctor-assignment/doctor/${doctor_id}?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error:any) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách yêu cầu');
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi' });
    }
  }
);

export const getAssignmentById = createAsyncThunk(
  'doctorAssignment/getAssignmentById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/doctor-assignment/${id}`);
      return response.data;
    } catch (error:any) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi lấy chi tiết yêu cầu');
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi' });
    }
  }
);

export const approveDoctorAndCreateSchedule = createAsyncThunk(
  'doctorAssignment/approveDoctorAndCreateSchedule',
  async ({ booking_request_id, doctor_id }: { booking_request_id: number; doctor_id: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/doctor-assignment/approve-doctor`, {
        booking_request_id,
        doctor_id
      });
      toast.success(response.data.message);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi phê duyệt bác sĩ');
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi' });
    }
  }
);

export const getBookingRequestWithAssignments = createAsyncThunk(
  'doctorAssignment/getBookingRequestWithAssignments',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/doctor-assignment/booking-detail/${id}`);
      return response.data;
    } catch (error:any) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi lấy thông tin chi tiết');
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi' });
    }
  }
);

export const getPendingDoctorAssignments = createAsyncThunk(
  'doctorAssignment/getPendingDoctorAssignments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/doctor-assignment/status/pending`, {
        withCredentials: true
      });
      return response.data;
    } catch (error:any) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách yêu cầu');
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi' });
    }
  }
);


interface AssignmentState {
  loading: boolean;
  error: string | null;
  assignmentsByBooking: any[];
  assignmentsByDoctor: {
    doctorAssignments: any[];
    total: number;
    total_pages: number;
    current_page: number;
  };
  currentAssignment: any | null;
  bookingRequestDetail: any;
  createdAssignment: any | null;
  updatedSchedule: any;
  selectedDoctorInfo: any;
  pendingAssignments: any[];
  message: string;
}





// Initial state
const initialState:AssignmentState = {
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
  updatedSchedule: null,
  selectedDoctorInfo: null,
  pendingAssignments: [],
  message: '',
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
        state.selectedDoctorInfo = action.payload.doctorInfo;
        if (state.assignmentsByBooking.length > 0) {
          state.assignmentsByBooking.push(action.payload.doctorAssignment);
        }
      })
      .addCase(requestDoctorAssignment.rejected, (state, action:any) => {
        state.loading = false;
        state.error = action.payload;
      })

      //get pending 
      .addCase(getPendingDoctorAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingDoctorAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingAssignments = action.payload.data;
      })
      .addCase(getPendingDoctorAssignments.rejected, (state, action:any) => {
        state.loading = false;
        state.error = action.payload.message;
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
          const index = state.assignmentsByBooking.findIndex((item:any) => item.id === action.payload.doctorAssignment.id);
          if (index !== -1) {
            state.assignmentsByBooking[index] = action.payload.doctorAssignment;
          }
        }
        
        if (state.assignmentsByDoctor.doctorAssignments.length > 0) {
          const index = state.assignmentsByDoctor.doctorAssignments.findIndex((item:any) =>
            item.id === action.payload.doctorAssignment.id
          );
          if (index !== -1) {
            state.assignmentsByDoctor.doctorAssignments[index] = action.payload.doctorAssignment;
          }
        }
      })
      .addCase(updateDoctorAssignment.rejected, (state, action:any) => {
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
      .addCase(getAssignmentsByBookingRequest.rejected, (state, action:any) => {
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
      .addCase(getAssignmentsByDoctor.rejected, (state, action:any) => {
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
      .addCase(getAssignmentById.rejected, (state, action:any) => {
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
          state.assignmentsByBooking = state.assignmentsByBooking.map((assignment:any) => {
            if (assignment.doctor_id === action.payload.schedule.doctor_id) {
              return { ...assignment, status: 'approved' };
            } else if (assignment.status === 'requested') {
              return { ...assignment, status: 'rejected' };
            }
            return assignment;
          });
        }
      })
      .addCase(approveDoctorAndCreateSchedule.rejected, (state, action:any) => {
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
      .addCase(getBookingRequestWithAssignments.rejected, (state, action:any) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearDoctorAssignmentErrors, clearCreatedAssignment } = doctorAssignmentSlice.actions;

export default doctorAssignmentSlice.reducer;