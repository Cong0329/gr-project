import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSchedule = createAsyncThunk("schedule/fetch", async () => {
  try {
    const response = await fetch("https://run.mocky.io/v3/f09bc285-5b09-48ef-b4c1-ebacd39bced0");
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
});
