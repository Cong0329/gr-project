import { createSlice } from "@reduxjs/toolkit";
import { Indication } from "../components/admin/pages/Forms/Product/Brand/types";
import { fetchIndications, createIndication, updateIndication, deleteIndication, getIndicationProductByName } from "./indicationAsyncThunk";
import { Product } from "../components/admin/pages/Forms/Product/Product";

interface IndicationState {
  indications: Indication[];
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string;
}

const initialState: IndicationState = {
  indications: [],
  products: [],
  status: "idle",
  error: '',
};


const indicationSlice = createSlice({
  name: "indication",
  initialState,
  reducers: {
    resetIndication: (state) => {
      state.products = [];
      state.status = 'idle';
    }
  },
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
    }).addCase(getIndicationProductByName.pending, (state) => {
        state.status = 'loading';
    }).addCase(getIndicationProductByName.fulfilled, (state, action) => {
        state.status = 'idle';
        state.products = action.payload.products;
    }).addCase(getIndicationProductByName.rejected, (state) => {
        state.status = 'failed';
    })
  }
})
export const { resetIndication } = indicationSlice.actions;
export default indicationSlice.reducer;