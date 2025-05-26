import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories, updateCategory, deleteCategory, createCategory, getParentCategory, getCategoryProduct } from "./categoryAsyncThunk";
import { Product } from "../components/admin/pages/Forms/Product/Product";

interface Category {
    name: string;
}


interface CategoryState {
    categories: Category[]
    parent: Category[]
    products: Product[]
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: CategoryState = {
    categories: [],
    parent: [],
    products: [],
    status: 'idle'
}

const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        resetCategory: (state) => {
            state.products = [];
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'idle';
                state.categories = action.payload.categories;
            })
            .addCase(fetchCategories.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(createCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createCategory.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(createCategory.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(updateCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCategory.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(updateCategory.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(deleteCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteCategory.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(deleteCategory.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(getParentCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getParentCategory.fulfilled, (state, action) => {
                state.status = 'idle';
                state.parent.push(action.payload);
            })
            .addCase(getParentCategory.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(getCategoryProduct.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getCategoryProduct.fulfilled, (state, action) => {
                state.status = 'idle';
                state.products = action.payload.products;
            })
            .addCase(getCategoryProduct.rejected, (state) => {
                state.status = 'failed';
            })
    }

})

export default categorySlice.reducer;
export const { resetCategory } = categorySlice.actions;

