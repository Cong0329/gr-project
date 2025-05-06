import { createSlice } from "@reduxjs/toolkit";
import { createReview, getPendingReviews, getReviews, replyReview, upadateReplyReview } from "./reviewsAsyncThunk";

export interface Review {
    id: string;
    comment: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    reply: Reply | null;
    user: {
        id: string;
        name: string;
        email: string;
        avatar_url: string;
    }
    product: {
        id: string;
        name: string;
    }
}

interface Reply {
    id: string;
    reply: string;
    createdAt: string;
    updatedAt: string;
    admin: {
        id: string;
        name: string;
        email: string;
    }
}

interface ReviewState {
    reviews: Review[];
    pendingReviews: Review[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    notifying: boolean;
}

const initialState: ReviewState = {
    reviews: [],
    pendingReviews: [],
    status: 'idle',
    error: null,
    notifying: false,
};

const reviewsSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {
        addReview: (state, action) => {
            state.reviews.unshift(action.payload);
        },
        addNotification(state, action) {
            state.pendingReviews.unshift(action.payload);
            state.notifying = true;
        },
        markAsRead(state, action) {
            state.notifying = action.payload;
        },
        clearNotifications(state) {
            state.pendingReviews = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createReview.fulfilled, (state) => {
            state.status = 'succeeded';
        })
            .addCase(createReview.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createReview.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(getPendingReviews.fulfilled, (state, action) => {
                state.pendingReviews = action.payload;
                state.status = 'idle';
            })
            .addCase(getPendingReviews.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getPendingReviews.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(getReviews.fulfilled, (state, action) => {
                state.reviews = action.payload;
                state.status = 'idle';
            })
            .addCase(getReviews.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getReviews.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(replyReview.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(replyReview.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(replyReview.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(upadateReplyReview.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(upadateReplyReview.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(upadateReplyReview.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const { addReview, addNotification, markAsRead, clearNotifications} = reviewsSlice.actions;
export default reviewsSlice.reducer;