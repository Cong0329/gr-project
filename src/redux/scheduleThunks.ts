import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSchedule = createAsyncThunk("schedule/fetch", async () => {
  try {
    const response = await fetch("https://run.mocky.io/v3/f8cf43e8-0d71-496e-8509-e26fe898855f");
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
});
