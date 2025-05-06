import { createSlice } from "@reduxjs/toolkit";
import { Indication } from "../components/admin/pages/Forms/Product/Brand/types";
import { fetchIndications, createIndication, updateIndication, deleteIndication } from "./indicationAsyncThunk";

interface IndicationState {
  indications: Indication[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string;
}

const initialState: IndicationState = {
  indications: [],
  status: "idle",
  error: '',
};


const indicationSlice = createSlice({
  name: "indication",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIndications.fulfilled, (state, action) => {
      state.indications = action.payload.indications;
      state.status = 'idle';
    }).addCase(fetchIndications.pending , (state) => {
        state.status = 'loading';
    }).addCase(fetchIndications.rejected, (state) => {
        state.status = 'failed';
    }).addCase(createIndication.pending, (state) => {
        state.status = 'loading';
    }).addCase(createIndication.fulfilled, (state) => {
        state.status = 'succeeded';
    }).addCase(createIndication.rejected, (state) => {
        state.status = 'failed';
    }).addCase(updateIndication.pending, (state) => {
        state.status = 'loading';
    }).addCase(updateIndication.fulfilled, (state) => {
        state.status = 'succeeded';
    }).addCase(updateIndication.rejected, (state) => {
        state.status = 'failed';
    }).addCase(deleteIndication.pending, (state) => {
        state.status = 'loading';
    }).addCase(deleteIndication.fulfilled, (state) => {
        state.status = 'succeeded';
    }).addCase(deleteIndication.rejected, (state) => {
        state.status = 'failed';
    })
  }
})

export default indicationSlice.reducer;