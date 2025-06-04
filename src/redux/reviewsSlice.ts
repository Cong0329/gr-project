import { createSlice } from "@reduxjs/toolkit";
import { createReview, getPendingReviews, getReviews, replyReview, upadateReplyReview } from "./reviewsAsyncThunk";
import { getAllMessagesAdmin, fetchMessagesAdmin, fetchMessagesUser, hidenMessage, sendMessageUser, sendMessageAdmin, unlockedMessages, getAllMessageUser, sendMessageDoctor } from "./messageAsyncThunk";

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

export interface Reply {
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


export interface Message {
    id: string;
    user_id: string;
    createdAt: string;
    updatedAt: string;
    locked_by: string;
    user1: {
        id: string;
        name: string;
        email: string;
        avatar_url: string;
    }
    user2: {
        id: string;
        name: string;
        email: string;
        avatar_url: string;
    }
}

export interface MessageItem {
    id: string;
    message_id: string;
    sender_id: string;
    content: string | null;
    image_url: string | null;
    createdAt: string;
    updatedAt: string;
    User: {
        id: string;
        name: string;
        avatar_url: string;
    }
}

export interface ReviewState {
    messages: Message[];
    reviews: Review[];
    messageItems: MessageItem[];
    messageItemsAdmin: MessageItem[];
    pendingReviews: Review[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    notifying: boolean;
}

const initialState: ReviewState = {
    messages: [],
    messageItems: [],
    messageItemsAdmin: [],
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
        addMessage(state, action) {
            state.messages.push(action.payload);
        },
        addMessageAdmin(state, action) {
            state.messageItemsAdmin.push(action.payload);
        },
        addMessageUser(state, action) {
            state.messageItems.push(action.payload);
        },
        clearMessages(state) {
            state.messageItems = [];
        },
        clearMessagesAdmin(state) {
            state.messageItemsAdmin = [];
        },
        moveUserToTopOrAdd: (state, action) => {
            const newUserMessage = action.payload;

            const existingIndex = state.messages.findIndex(
                (item) => item.user2.id === newUserMessage.user2.id
            );

            if (existingIndex > -1) {
                // Nếu đã có, di chuyển lên đầu
                const [existing] = state.messages.splice(existingIndex, 1);
                state.messages.unshift(existing);
            } else {
                // Nếu chưa có, thêm mới vào đầu
                state.messages.unshift(newUserMessage);
            }
        }

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
            })
            .addCase(getAllMessagesAdmin.fulfilled, (state, action) => {
                state.messages = action.payload;
                state.status = 'idle';
            })
            .addCase(getAllMessagesAdmin.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllMessagesAdmin.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(fetchMessagesAdmin.fulfilled, (state, action) => {
                state.messageItemsAdmin = action.payload;
                state.status = 'idle';
            })
            .addCase(fetchMessagesAdmin.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMessagesAdmin.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(fetchMessagesUser.fulfilled, (state, action) => {
                state.messageItems = action.payload;
                state.status = 'idle';
            })
            .addCase(fetchMessagesUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMessagesUser.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(hidenMessage.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(hidenMessage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(hidenMessage.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(sendMessageAdmin.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(sendMessageAdmin.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(sendMessageAdmin.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(sendMessageUser.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(sendMessageUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(sendMessageUser.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(unlockedMessages.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(unlockedMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(unlockedMessages.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(getAllMessageUser.fulfilled, (state, action) => {
                state.messages = action.payload;
                state.status = 'idle';
            })
            .addCase(getAllMessageUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllMessageUser.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(sendMessageDoctor.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(sendMessageDoctor.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(sendMessageDoctor.rejected, (state) => {
                state.status = 'failed';
            })
    },
});

export const { addReview, addNotification, markAsRead, clearNotifications, addMessage, addMessageAdmin, addMessageUser, clearMessages, clearMessagesAdmin, moveUserToTopOrAdd } = reviewsSlice.actions;
export default reviewsSlice.reducer;