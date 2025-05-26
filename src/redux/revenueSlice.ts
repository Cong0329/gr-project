import { createSlice } from "@reduxjs/toolkit";
import { fetchMonthlyTarget, fetchOrderRevenue, fetchTarget, fetchUserRevenue } from "./revenueAsyncThunk";

interface UserRevenue {
    month: string;
    user_count: number;
    growth: number | null;
}

interface OrderRevenue {
    month: string;
    order_count: number;
    total_revenue: number;
    total_discount: number;
    revenue_growth: number | null;
}

interface RevenueState {
    userRevenue: UserRevenue[];
    orderRevenue: OrderRevenue[];
    target: number;
    monthlyTarget: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}


const initialState: RevenueState = {
    userRevenue: [],
    orderRevenue: [],
    target: 0,
    monthlyTarget: 0,
    status: 'idle'
}

const revenueSlice = createSlice({
    name: 'revenue',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUserRevenue.fulfilled, (state, action) => {
            state.userRevenue = action.payload;
            state.status = 'idle';
        });
        builder.addCase(fetchUserRevenue.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchUserRevenue.rejected, (state) => {
            state.status = 'failed';
        });
        builder.addCase(fetchOrderRevenue.fulfilled, (state, action) => {
            state.orderRevenue = action.payload;
            state.status = 'idle';
        });
        builder.addCase(fetchOrderRevenue.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchOrderRevenue.rejected, (state) => {
            state.status = 'failed';
        });
        builder.addCase(fetchTarget.fulfilled, (state, action) => {
            state.target = action.payload.total_revenue;
            state.status = 'idle';
        });
        builder.addCase(fetchTarget.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchTarget.rejected, (state) => {
            state.status = 'failed';
        });
        builder.addCase(fetchMonthlyTarget.fulfilled, (state, action) => {
            state.monthlyTarget = action.payload.total_revenue;
            state.status = 'idle';
        });
        builder.addCase(fetchMonthlyTarget.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(fetchMonthlyTarget.rejected, (state) => {
            state.status = 'failed';
        });
    }
})

export default revenueSlice.reducer
