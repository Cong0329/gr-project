import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSchedule = createAsyncThunk("schedule/fetch", async () => {
  const response = await axios.get("https://run.mocky.io/v3/c2ec429b-94b8-40bf-8826-c398f1f44664");
  return response.data; 
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
          : [action.payload];
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default scheduleSlice.reducer;
