import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDoctors = createAsyncThunk("doctors/fetch", async () => {
  const response = await axios.get(
    "https://run.mocky.io/v3/34c0de21-dd68-4302-a806-d5019160311c"
  );
  return response.data;
});

const doctorSlice = createSlice({
  name: "doctors",
  initialState: {
    doctors: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default doctorSlice.reducer;
