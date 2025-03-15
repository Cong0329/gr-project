import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSchedule = createAsyncThunk("schedule/fetch", async () => {
  try {
    const response = await fetch("https://run.mocky.io/v3/897765ac-ca3b-43a1-bd8f-cf6711389704");
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
});
