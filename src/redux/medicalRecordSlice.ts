import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

export const getDoctorMedicalRecords = createAsyncThunk(
  'medicalRecord/getDoctorMedicalRecords',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/medical-record/doctor-record`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi khi lấy danh sách hồ sơ bệnh án'
      );
    }
  }
);

export const createMedicalRecord = createAsyncThunk(
  'medicalRecord/createMedicalRecord',
  async (recordData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_NODEJS_BACKEND_URL}/medical-record/create`,
        recordData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi khi tạo hồ sơ bệnh án'
      );
    }
  }
);

interface RecordPropsState {
  records: any[],

  loading: boolean,
  createLoading: boolean,

  error: any,
  createError: any,

  createSuccess: boolean,

  totalRecords: 0,
  currentPage: 1,
  totalPages: 1
}

const initialState: RecordPropsState = {
  records: [],

  loading: false,
  createLoading: false,

  error: null,
  createError: null,

  createSuccess: false,

  totalRecords: 0,
  currentPage: 1,
  totalPages: 1
};

const medicalRecordSlice = createSlice({
  name: 'medicalRecord',
  initialState,
  reducers: {
    // Reset create states
    resetCreateState: (state) => {
      state.createLoading = false;
      state.createError = null;
      state.createSuccess = false;
    },

    // Clear all errors
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
    },

    // Reset entire state
    resetMedicalRecordState: () => initialState,

    // Set current page (nếu có pagination)
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get doctor medical records
      .addCase(getDoctorMedicalRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorMedicalRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data || [];
        state.totalRecords = action.payload.data?.length || 0;
        state.error = null;
      })
      .addCase(getDoctorMedicalRecords.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
        state.records = [];
      })

      // Create medical record
      .addCase(createMedicalRecord.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createMedicalRecord.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        state.createError = null;

        // Thêm record mới vào đầu danh sách
        if (action.payload.data) {
          state.records.unshift(action.payload.data);
          state.totalRecords += 1;
        }
      })
      .addCase(createMedicalRecord.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
        state.createSuccess = false;
      });
  }
});

// Export actions
export const {
  resetCreateState,
  clearErrors,
  resetMedicalRecordState,
  setCurrentPage
} = medicalRecordSlice.actions;

// Selectors
export const selectMedicalRecords = (state:RootState) => state.medicalRecord.records;
export const selectMedicalRecordLoading = (state:RootState) => state.medicalRecord.loading;
export const selectMedicalRecordError = (state:RootState) => state.medicalRecord.error;
export const selectCreateLoading = (state:RootState) => state.medicalRecord.createLoading;
export const selectCreateError = (state:RootState) => state.medicalRecord.createError;
export const selectCreateSuccess = (state:RootState) => state.medicalRecord.createSuccess;
export const selectTotalRecords = (state:RootState) => state.medicalRecord.totalRecords;
export const selectCurrentPage = (state:RootState) => state.medicalRecord.currentPage;

// Export reducer
export default medicalRecordSlice.reducer;