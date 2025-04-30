import { createSlice } from "@reduxjs/toolkit";
import { fetchMedicalObjects, createMedicalObject, updateMedicalObject, deleteMedicalObject } from "./medicalObjectAsyncThunk";

interface MedicalObject {
    name: string;
}

interface MedicalObjectState {
    medicalObjects: MedicalObject[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}


const initialState: MedicalObjectState = {
    medicalObjects: [],
    status: 'idle'
}


const medicalObjectSlice = createSlice({
    name: 'medicalObject',
    initialState,
    reducers: {},
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
    }
})

export default medicalObjectSlice.reducer;

