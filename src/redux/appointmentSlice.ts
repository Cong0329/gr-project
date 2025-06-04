import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Appointment {
  id: string;
  user_id: string;
  doctor_id: string;
  schedule_id: number;
  date: string;
  start_time: string;
  end_time: string;
  type: 'specialist' | 'specialist_online' | 'general' | 'medical';
  service_id: number;
  payment_method: 'cash' | 'online';
  status: 'pending_payment' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
  patient_info?: {
    name: string;
    phone: string;
    email: string;
    dob: string;
    gender: string;
    address: string;
    reason?: string;
  };
  doctor?: {
    id: string;
    name: string;
    avatar_url: string;
    specialization: string;
  };
  schedule?: any;
  serviceInfo?: any;
}

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  createSuccess: boolean;
  createError: string | null;
  confirming?: boolean;
  confirmSuccess?: boolean;
  cancelling?: boolean;
  cancelSuccess?: boolean;
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  error: null,
  creating: false,
  createSuccess: false,
  createError: null,
};

export const createAppointment = createAsyncThunk(
    'appointment/create',
    async (appointmentData: Partial<Appointment>, { rejectWithValue }) => {
      try {
        console.log('Data being sent:', appointmentData);
        const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/appointment/create`, appointmentData);
        return response.data.data;
      } catch (error: any) {
        console.error('API Error Response:', error.response?.data);
        console.error('API Error Status:', error.response?.status);
        console.error('API Error Headers:', error.response?.headers);
        return rejectWithValue(error.response?.data?.message || 'Failed to create appointment');
      }
    }
  );

  export const confirmAppointment = createAsyncThunk(
    'appointment/confirm',
    async ({ appointmentId, userInfo }: ConfirmAppointmentParams, { rejectWithValue }) => {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_NODEJS_BACKEND_URL}/appointment/${appointmentId}/status`,
          {
            status: 'confirmed',
            patient_info: {
              name: userInfo.fullName,
              phone: userInfo.phone,
              email: userInfo.email,
              dob: userInfo.birthDate,
              gender: userInfo.gender,
              address: userInfo.address,
              reason: userInfo.reason
            }
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('API Response on confirm:', response.data);
        return response.data.data;
      } catch (error: any) {
        console.error('API Error on confirm:', error.response?.data);
        console.error('API Error Status:', error.response?.status);
        console.error('API Error Details:', error.response?.data?.errors);
        return rejectWithValue(error.response?.data?.message || 'Failed to confirm appointment');
      }
    }
  );

export const cancelAppointment = createAsyncThunk(
  'appointment/cancel',
  async ({ id, reason }: { id: string; reason?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_NODEJS_BACKEND_URL}/appointment/${id}/cancel`,
        { reason },
        { withCredentials: true }
      );
      
      
      return response.data.data;
    } catch (error: any) {
      console.error('Cancel appointment error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel appointment');
    }
  }
);

export const getUserAppointment = createAsyncThunk(
  'appointment/getUserAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/appointment/user/me`, {
        withCredentials: true
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const getDoctorAppointments = createAsyncThunk(
  'appointment/getDoctorAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/appointment/doctor-schedule/me`, {
        withCredentials: true
      });
      console.log('API Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctor appointments');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    resetCreateStatus: (state) => {
      state.createSuccess = false;
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
     .addCase(getUserAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(createAppointment.pending, (state) => {
        state.creating = true;
        state.createSuccess = false;
        state.createError = null;
      })
      .addCase(getDoctorAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(createAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.creating = false;
        state.createSuccess = true;
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload as string;
      })

      .addCase(confirmAppointment.fulfilled, (state, action) => {
        console.log("confirmAppointment.fulfilled payload:", action.payload);
  
        if (!action.payload || !action.payload.appointmentId) {
          console.error("Missing appointmentId in payload");
          return;
        }
  
        const appointmentId = action.payload.appointmentId;
  
        if (!state.appointments || !Array.isArray(state.appointments)) {
          console.error("state.appointments is not an array");
          return;
        }
  
        const index = state.appointments.findIndex(item =>
          item && item.id === appointmentId
        );
  
        if (index !== -1) {
          state.appointments[index].status = 'confirmed';
          if (action.payload.patient_info) {
            state.appointments[index].patient_info = action.payload.patient_info;
          }
        } else {
          console.warn(`Appointment with id ${appointmentId} not found in state`);
          if (action.payload.appointment) {
            state.appointments.push({
              ...action.payload.appointment,
              status: 'confirmed'
            });
          }
        }
  
        state.confirming = false;
        state.confirmSuccess = true;
      })
  
      .addCase(confirmAppointment.rejected, (state, action) => {
        state.confirming = false;
        
        console.error('Confirm appointment rejected:', action);
        
        if (action.payload) {
          state.error = typeof action.payload === 'string' 
            ? action.payload 
            : JSON.stringify(action.payload);
        } else {
          state.error = action.error.message || "Lỗi xác nhận lịch hẹn";
        }
      })
  
      // Cancel
      .addCase(cancelAppointment.pending, (state) => {
        state.cancelling = true;
        state.cancelSuccess = false;
        state.error = null;
      })
      .addCase(cancelAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.cancelling = false;
        state.cancelSuccess = true;
        const index = state.appointments.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index].status = 'cancelled';
          if (action.payload.patient_info) {
            state.appointments[index].patient_info = action.payload.patient_info;
          }
        }
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.cancelling = false;
        state.cancelSuccess = false;
        state.error = typeof action.payload === 'string'
          ? action.payload
          : JSON.stringify(action.payload);
      })

  }
});

export const { resetCreateStatus } = appointmentSlice.actions;

export default appointmentSlice.reducer;