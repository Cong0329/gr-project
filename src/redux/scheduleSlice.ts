import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSchedule = createAsyncThunk("schedule/fetch", async () => {
  try {
    const response = await fetch("https://run.mocky.io/v3/229b27c8-38d6-4a56-928e-d69f4e9c07a9");
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
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
        state.schedules = action.payload;
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default scheduleSlice.reducer;
