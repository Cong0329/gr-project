import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories, updateCategory, deleteCategory, createCategory } from "./categoryAsyncThunk";

interface Category {
    name: string;
}


interface CategoryState {
    categories: Category[]
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: CategoryState = {
    categories: [],
    status: 'idle'
}

const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
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
    }

})

export default categorySlice.reducer;
