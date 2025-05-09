import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

// Create booking request
export const createBookingRequest = createAsyncThunk(
  'packageBooking/createBookingRequest',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/pkg-booking-request`, bookingData);
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
      const response = await axios.get(`${API_URL}/pkg-booking-request/${bookingId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi khi lấy thông tin chi tiết' });
    }
  }
);

// Get all booking requests (admin/staff)
export const getAllBookingRequests = createAsyncThunk(
  'packageBooking/getAllBookingRequests',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/pkg-booking-request`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi khi lấy danh sách yêu cầu đặt lịch' });
    }
  }
);

// Get user booking requests
export const getUserBookingRequests = createAsyncThunk(
  'packageBooking/getUserBookingRequests',
  async ({ userId, params }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/pkg-booking-request/users/${userId}`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi khi lấy danh sách yêu cầu đặt lịch' });
    }
  }
);

// Cancel booking request
export const cancelBookingRequest = createAsyncThunk(
  'packageBooking/cancelBookingRequest',
  async ({ bookingId, cancellationReason }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/pkg-booking-request/${bookingId}/cancel`, { 
        cancellation_reason: cancellationReason 
      });
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
      const response = await axios.post(`${API_URL}/pkg-booking-request/assign-schedule`, scheduleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Đã xảy ra lỗi khi gán lịch' });
    }
  }
);

const initialState = {
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
      
      // Get all booking requests
      .addCase(getAllBookingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBookingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingRequests = action.payload.bookingRequests;
        state.pagination = {
          total: action.payload.total,
          totalPages: action.payload.total_pages,
          currentPage: action.payload.current_page,
        };
      })
      .addCase(getAllBookingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get user booking requests
      .addCase(getUserBookingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserBookingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingRequests = action.payload.bookingRequests;
        state.pagination = {
          total: action.payload.total,
          totalPages: action.payload.total_pages,
          currentPage: action.payload.current_page,
        };
      })
      .addCase(getUserBookingRequests.rejected, (state, action) => {
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
      });
  },
});

export const { resetBookingState, clearCurrentBookingRequest } = packageBookingSlice.actions;

export default packageBookingSlice.reducer;