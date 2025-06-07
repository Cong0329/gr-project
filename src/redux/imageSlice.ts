import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

// Định nghĩa kiểu dữ liệu cho kết quả trả về từ API
interface UploadImageResponse {
  class_name: string;
  probabilities: { [key: string]: number };  // Mảng có cấu trúc đơn giản hơn
  image_url: string;
}

// Định nghĩa kiểu dữ liệu cho lỗi trả về từ API
interface UploadImageError {
  message: string;
}

interface PredictImageResponse {
  class_name: string;
  probabilities: { [key: string]: number };  // Định nghĩa lại kiểu cho probabilities
  image_url: string;
  description: string;
  treatment: string;
  suggested_meds: string[];
  department: string;
}
// Định nghĩa kiểu dữ liệu cho state của slice
interface ImageState {
  predict: PredictImageResponse;
  loading: boolean;
  error: string | null;
}

// Khởi tạo state ban đầu
const initialState: ImageState = {
  predict: {} as PredictImageResponse,
  loading: false,
  error: null,
};

// Thunk để upload hình ảnh
export const uploadImage = createAsyncThunk<UploadImageResponse, File, { rejectValue: UploadImageError }>(
  'image/uploadImage',
  async (file, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post<UploadImageResponse>(`${import.meta.env.VITE_PREDICT_SKIN_URL}/classify/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      // Nếu lỗi không phải từ Axios, trả về lỗi chung
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);

// Tạo slice
const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    reset: (state) => {
      // Đặt lại các state về giá trị ban đầu
      state.predict = {} as PredictImageResponse;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action:any) => {
        state.loading = false;
        state.predict = action.payload;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Upload failed';
      });
  },
});

export const { reset } = imageSlice.actions;
export default imageSlice.reducer;
