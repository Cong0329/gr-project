import { getBrandProduct } from "./brandAsyncThunk";
import { getCategoryProduct } from "./categoryAsyncThunk";
import { searchMedicine } from "./sliceAsyncThunk";
import { createSlice } from "@reduxjs/toolkit";


export interface Product {
    id: string;
    name: string;
    slug: string;
    images: ProductImage[];
    quantity: number;
    options: ProductOption[];
    specification: string;
    brand: Brand;
    category: Category;
    medical_object: MedicalObject;
    indication: Indication;
    type: boolean;
}

interface ProductOption {
    id: string;
    label: string;
    price: number;
    discounted_price: number;
}

interface ProductImage {
    id: string;
    image: string;
}

interface Brand {
    id: string;
    name: string;
    country: string;
    original: string;
}

interface Category {
    id: string;
    name: string;
}

interface MedicalObject {
    id: string;
    name: string;
}

interface Indication {
    id: string;
    name: string;
}

interface SearchState {
    products: Product[];
    loading: boolean;
    status: 'idle' | 'loading' | 'failed' | 'succeeded';
    error: string | null;
}

const initialState: SearchState = {
    products: [],
    loading: false,
    status: 'idle',
    error: null,
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(searchMedicine.pending, (state) => {
            state.status = 'loading';
            state.loading = true;
            state.products = [];
       }).addCase(searchMedicine.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.products = action.payload;
            state.loading = false;
        }).addCase(searchMedicine.rejected, (state) => {
            state.status = 'failed';
            state.loading = false;
        }).addCase(getBrandProduct.pending, (state) => {
            state.status = 'loading';
            state.loading = true;
            state.products = [];
       }).addCase(getBrandProduct.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.products = action.payload.products;
            state.loading = false;
        }).addCase(getBrandProduct.rejected, (state) => {
            state.status = 'failed';
            state.loading = false;
        }).addCase(getCategoryProduct.pending, (state) => {
            state.status = 'loading';
            state.loading = true;
            state.products = [];
       }).addCase(getCategoryProduct.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.products = action.payload.products;
            state.loading = false;
        }).addCase(getCategoryProduct.rejected, (state) => {
            state.status = 'failed';
            state.loading = false;
        })
    },
});

export default searchSlice.reducer;
