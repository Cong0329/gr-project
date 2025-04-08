import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for API calls
const API_BASE_URL = "https://run.mocky.io/v3/e06f9b6f-74ef-4ad0-98ce-d6ac4df9336d";

// Fetch different types of schedules
export const fetchSpecialistSchedules = createAsyncThunk(
  "schedule/fetchSpecialist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/schedules/specialist`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch specialist schedules");
    }
  }
);

export const fetchGeneralSchedules = createAsyncThunk(
  "schedule/fetchGeneral",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/schedules/general`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch general schedules");
    }
  }
);

export const fetchMedicalSchedules = createAsyncThunk(
  "schedule/fetchMedical",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/schedules/medical`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch medical schedules");
    }
  }
);

// Create new appointment request
export const createAppointment = createAsyncThunk(
  "schedule/createAppointment",
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/appointments`, appointmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create appointment");
    }
  }
);

// Doctor confirms appointment and creates schedule
export const confirmAppointment = createAsyncThunk(
  "schedule/confirmAppointment",
  async ({ appointmentId, scheduleData }, { rejectWithValue }) => {
    try {
      // Update appointment status
      await axios.patch(`${API_BASE_URL}/appointments/${appointmentId}`, { status: "confirmed" });
      
      // Create actual schedule entry
      const response = await axios.post(`${API_BASE_URL}/schedules`, scheduleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to confirm appointment");
    }
  }
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    specialistSchedules: [],
    generalSchedules: [],
    medicalSchedules: [],
    pendingAppointments: [],
    confirmedAppointments: [],
    loading: {
      specialist: false,
      general: false,
      medical: false,
      createAppointment: false,
      confirmAppointment: false
    },
    error: {
      specialist: null,
      general: null,
      medical: null,
      createAppointment: null,
      confirmAppointment: null
    },
  },
  reducers: {
    clearErrors: (state) => {
      state.error = {
        specialist: null,
        general: null,
        medical: null,
        createAppointment: null,
        confirmAppointment: null
      };
    },
    filterSchedulesByDoctor: (state, action) => {
      const { doctorId, scheduleType } = action.payload;
      if (scheduleType === 'specialist') {
        state.specialistSchedules = state.specialistSchedules.filter(
          schedule => schedule.doctor_id === doctorId
        );
      } else if (scheduleType === 'general') {
        state.generalSchedules = state.generalSchedules.filter(
          schedule => schedule.doctor_id === doctorId
        );
      } else if (scheduleType === 'medical') {
        state.medicalSchedules = state.medicalSchedules.filter(
          schedule => schedule.doctor_id === doctorId
        );
      }
    },
    filterAppointmentsByStatus: (state, action) => {
      const status = action.payload;
      state.pendingAppointments = state.pendingAppointments.filter(
        appointment => appointment.status === status
      );
    }
  },
  extraReducers: (builder) => {
    builder
      // Specialist schedules
      .addCase(fetchSpecialistSchedules.pending, (state) => {
        state.loading.specialist = true;
      })
      .addCase(fetchSpecialistSchedules.fulfilled, (state, action) => {
        state.loading.specialist = false;
        state.specialistSchedules = action.payload;
      })
      .addCase(fetchSpecialistSchedules.rejected, (state, action) => {
        state.loading.specialist = false;
        state.error.specialist = action.payload;
      })
      
      // General schedules
      .addCase(fetchGeneralSchedules.pending, (state) => {
        state.loading.general = true;
      })
      .addCase(fetchGeneralSchedules.fulfilled, (state, action) => {
        state.loading.general = false;
        state.generalSchedules = action.payload;
      })
      .addCase(fetchGeneralSchedules.rejected, (state, action) => {
        state.loading.general = false;
        state.error.general = action.payload;
      })
      
      // Medical schedules
      .addCase(fetchMedicalSchedules.pending, (state) => {
        state.loading.medical = true;
      })
      .addCase(fetchMedicalSchedules.fulfilled, (state, action) => {
        state.loading.medical = false;
        state.medicalSchedules = action.payload;
      })
      .addCase(fetchMedicalSchedules.rejected, (state, action) => {
        state.loading.medical = false;
        state.error.medical = action.payload;
      })
      
      // Create appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading.createAppointment = true;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading.createAppointment = false;
        state.pendingAppointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading.createAppointment = false;
        state.error.createAppointment = action.payload;
      })
      
      // Confirm appointment
      .addCase(confirmAppointment.pending, (state) => {
        state.loading.confirmAppointment = true;
      })
      .addCase(confirmAppointment.fulfilled, (state, action) => {
        state.loading.confirmAppointment = false;
        
        // Move appointment from pending to confirmed
        const appointmentId = action.meta.arg.appointmentId;
        const appointmentIndex = state.pendingAppointments.findIndex(
          app => app.id === appointmentId
        );
        
        if (appointmentIndex !== -1) {
          const appointment = state.pendingAppointments[appointmentIndex];
          state.pendingAppointments.splice(appointmentIndex, 1);
          state.confirmedAppointments.push({
            ...appointment,
            status: 'confirmed'
          });
        }
        
        // Add new schedule based on type
        const scheduleData = action.payload;
        if (scheduleData.type === 'specialist') {
          state.specialistSchedules.push(scheduleData);
        } else if (scheduleData.type === 'general') {
          state.generalSchedules.push(scheduleData);
        } else if (scheduleData.type === 'medical') {
          state.medicalSchedules.push(scheduleData);
        }
      })
      .addCase(confirmAppointment.rejected, (state, action) => {
        state.loading.confirmAppointment = false;
        state.error.confirmAppointment = action.payload;
      });
  },
});

export const { clearErrors, filterSchedulesByDoctor, filterAppointmentsByStatus } = scheduleSlice.actions;
export default scheduleSlice.reducer;