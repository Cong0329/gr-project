import { createSlice } from "@reduxjs/toolkit";
import { fetchBrands, updateBrand, createBrand, deleteBrand, getBrandProduct } from "./brandAsyncThunk";
import { Product } from "../components/admin/pages/Forms/Product/Product";

interface BrandState {
  brands: Brand[];
  products: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

interface Brand {
  id: string;
  name: string;
  logo: string;
  country: string;
  original: string;
}


const initialState: BrandState = {
  brands: [],
  products: [],
  status: "idle"
}





const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    setBrands: (state, action) => {
      state.brands = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBrands.fulfilled, (state, action) => {
      state.brands = action.payload.brands;
      state.status = 'idle';
    })
      .addCase(fetchBrands.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBrand.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateBrand.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateBrand.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(createBrand.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createBrand.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(createBrand.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(deleteBrand.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteBrand.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(deleteBrand.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(getBrandProduct.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.status = 'idle';
      })
      .addCase(getBrandProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBrandProduct.rejected, (state) => {
        state.status = 'failed';
      })
  }
});

export const { setBrands } = brandSlice.actions;
export default brandSlice.reducer;