import { createSlice } from "@reduxjs/toolkit";
import { fetchMedicalObjects, createMedicalObject, updateMedicalObject, deleteMedicalObject, getMedicalObjectProductByName } from "./medicalObjectAsyncThunk";
import { Product } from "../components/admin/pages/Forms/Product/Product";
interface MedicalObject {
    id: string;
    name: string;
}

interface MedicalObjectState {
    medicalObjects: MedicalObject[];
    products: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed' ;
}


const initialState: MedicalObjectState = {
    medicalObjects: [],
    products: [],
    status: 'idle'
}


const medicalObjectSlice = createSlice({
    name: 'medicalObject',
    initialState,
    reducers: {
        resetMedicalObject: (state) => {
            state.products = [];
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMedicalObjects.fulfilled, (state, action) => {
                state.medicalObjects = action.payload.medical_objects;
                state.status = 'idle';
            })
            .addCase(fetchMedicalObjects.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMedicalObjects.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(createMedicalObject.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createMedicalObject.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(createMedicalObject.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(updateMedicalObject.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateMedicalObject.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(updateMedicalObject.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(deleteMedicalObject.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteMedicalObject.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(deleteMedicalObject.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(getMedicalObjectProductByName.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getMedicalObjectProductByName.fulfilled, (state, action) => {
                state.status = 'idle';
                state.products = action.payload.products;
            })
            .addCase(getMedicalObjectProductByName.rejected, (state) => {
                state.status = 'failed';
            })
    }
})
export const { resetMedicalObject } = medicalObjectSlice.actions;
export default medicalObjectSlice.reducer;

