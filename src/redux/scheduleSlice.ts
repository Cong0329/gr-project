import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk để fetch lịch khám
export const fetchSchedule = createAsyncThunk("schedule/fetch", async () => {
  const response = await axios.get("https://run.mocky.io/v3/897765ac-ca3b-43a1-bd8f-cf6711389704");
  return response.data; // Đảm bảo API trả về **mảng**
});

const scheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    schedules: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = Array.isArray(action.payload)
          ? action.payload
          : [action.payload]; // 🔥 Đảm bảo luôn là mảng
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default scheduleSlice.reducer;
