import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSchedule = createAsyncThunk("schedule/fetch", async () => {
  try {
    const response = await fetch("https://run.mocky.io/v3/c2ec429b-94b8-40bf-8826-c398f1f44664");
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
});
