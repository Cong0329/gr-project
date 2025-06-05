import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface PackageBooking {
  id: number;
  user_id: string;
  package_type: 'general' | 'medical';
    package_id: number;
    requested_date: string;
    requested_time_slot: string;
    status: 'pending' | 'doctor_requested' | 'assigned' | 'rejected' | 'cancelled';
    notes?: string;
    schedule_id?: number;
    package?: {
      id: number;
      name: string;
      description: string;
      price: number;
      duration: number;
      type: string;
      features?: any[];
    };
    schedule?: {
      id: number;
      date: string;
      start_time: string;
      end_time: string;
      doctor?: {
        id: string;
        name: string;
        avatar: string;
        type: string;
      };
    };
    patient_info?: {
    name: string;
    phone: string;
    email: string;
    dob: string;
    gender: string;
    address: string;
    reason?: string;
    };
    doctorAssignments?: any[];
  }

interface PackageBookingState {
  bookingRequests: PackageBooking[];
  currentBookingRequest: PackageBooking | null;
  loading: boolean;
  error: any;
  success: boolean;
  message: string;
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
  };
  
}

const initialState: PackageBookingState = {
  bookingRequests: [],
  currentBookingRequest: null,
  loading: false,
  error: null,
  success: false,
  message: '',
  pagination: {
    total: 0,
    totalPages: 0,
    currentPage: 1,
  },
};


export const getUserPackageBooking = createAsyncThunk(
  'packageBooking/getUserPackageBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/pkg-booking-request/user/me`, {
        withCredentials: true
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi khi lấy lịch đặt gói khám' });
    }
  }
);

// Create booking request
export const createBookingRequest = createAsyncThunk(
  'packageBooking/createBookingRequest',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/pkg-booking-request`, bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi khi tạo yêu cầu đặt lịch' });
    }
  }
);

// Get booking request details
export const getBookingRequestDetails = createAsyncThunk(
  'packageBooking/getBookingRequestDetails',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/pkg-booking-request/${bookingId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi khi lấy thông tin chi tiết' });
    }
  }
);

// Get all booking requests
// getAllBookingRequests.ts
export const getAllBookingRequests = createAsyncThunk(
  'packageBooking/getAllBookingRequests',
  async ({ date, packageId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/pkg-booking-request`, {
        params: {
          date,
          ...(packageId ? { package_id: packageId } : {})
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Lỗi khi lấy danh sách booking' }
      );
    }
  }
);


// Cancel booking request
export const cancelBookingRequest = createAsyncThunk(
  'packageBooking/cancelBookingRequest',
  async ({ bookingId, cancellationReason }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_NODEJS_BACKEND_URL}/pkg-booking-request/${bookingId}/cancel`, 
        { 
          cancellation_reason: cancellationReason 
        },
        {
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi khi hủy yêu cầu đặt lịch' });
    }
  }
);

// Assign schedule
export const assignSchedule = createAsyncThunk(
  'packageBooking/assignSchedule',
  async (scheduleData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/pkg-booking-request/assign-schedule`, scheduleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi khi gán lịch' });
    }
  }
);


const packageBookingSlice = createSlice({
  name: 'packageBooking',
  initialState,
  reducers: {
    resetBookingState: (state) => {
      state.success = false;
      state.error = null;
      state.message = '';
    },
    clearCurrentBookingRequest: (state) => {
      state.currentBookingRequest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserPackageBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPackageBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingRequests = action.payload;
      })
      .addCase(getUserPackageBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create booking request
      .addCase(createBookingRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentBookingRequest = action.payload;
        state.message = 'Đã tạo yêu cầu đặt lịch thành công';
      })
      .addCase(createBookingRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get booking request details
      .addCase(getBookingRequestDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingRequestDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBookingRequest = action.payload;
      })
      .addCase(getBookingRequestDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      
      // Cancel booking request
      .addCase(cancelBookingRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBookingRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        
        // Cập nhật currentBookingRequest nếu đang xem chi tiết booking request này
        if (state.currentBookingRequest && state.currentBookingRequest.id === action.payload.bookingRequest.id) {
          state.currentBookingRequest = action.payload.bookingRequest;
        }
        
        // Cập nhật booking request trong danh sách
        const index = state.bookingRequests.findIndex(b => b.id === action.payload.bookingRequest.id);
        if (index !== -1) {
          state.bookingRequests[index] = action.payload.bookingRequest;
        }
      })
      .addCase(cancelBookingRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Assign schedule
      .addCase(assignSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        
        // Cập nhật currentBookingRequest nếu đang xem chi tiết booking request này
        if (state.currentBookingRequest && state.currentBookingRequest.id === action.payload.bookingRequest.id) {
          state.currentBookingRequest = action.payload.bookingRequest;
        }
        
        // Cập nhật booking request trong danh sách
        const index = state.bookingRequests.findIndex(b => b.id === action.payload.bookingRequest.id);
        if (index !== -1) {
          state.bookingRequests[index] = action.payload.bookingRequest;
        }
      })
      .addCase(assignSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllBookingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBookingRequests.fulfilled, (state, action) => {
        console.log("getAllBookingRequests.fulfilled - payload:", action.payload);
        console.log("getAllBookingRequests.fulfilled - payload type:", typeof action.payload);
        console.log("getAllBookingRequests.fulfilled - payload.data:", action.payload?.data);
        
        state.loading = false;
        
        // Kiểm tra structure của response
        if (Array.isArray(action.payload)) {
          state.bookingRequests = action.payload;
        } else if (action.payload?.data && Array.isArray(action.payload.data)) {
          state.bookingRequests = action.payload.data;
        } else {
          console.error("Unexpected payload structure:", action.payload);
          state.bookingRequests = [];
        }
        
        console.log("State after update:", state.bookingRequests);
      })
      .addCase(getAllBookingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Lỗi không xác định';
      });
  },
});

export const { resetBookingState, clearCurrentBookingRequest } = packageBookingSlice.actions;

export default packageBookingSlice.reducer;