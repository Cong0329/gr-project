import { createSlice } from '@reduxjs/toolkit';
import { createOrder, fetchAdminOrderById, fetchAdminOrders, fetchOrderById, fetchOrders, updateOrderConfirm } from './orderAsyncThunk';



export interface OrderForm {
    shipping_address_id: string, cartItemIds: number[], payment_method: string, note: string
}

export interface Order {
    id: number;
    createdAt: string;
    updatedAt: string;
    status: 'shipping' | 'cancelled' | 'pending' | 'completed' | 'confirmed' | 'return';
    total_price: number;
    discout_price: number;
    note: string;
    user: User;
    items: OrderItem[];
    shipping_address: OrderShippingAddress;
    payment_method: Payment;
    status_history: StatusHistory[];
}

interface User {
    id: number;
    name: string;
    email: string;
}
interface StatusHistory {
    id: number;
    status: string;
    order_id: string;
    changed_at: string;
}

interface Product {
    id: number;
    name: string;
    images: Image[];
}

interface Image {
    id: number;
    image: string;
}

export interface OrderItem {
    id: number;
    quantity: number;
    product: Product;
    price: number;
    option: string;
}

interface OrderShippingAddress {
    id: number;
    name: string;
    phone: string;
    street: string;
    ward: string;
    district: string;
    province: string;
    type: string;
    default_address: boolean;
}

interface Payment {
    id: number;
    method: string;
    description: string;
}

interface OrderState {
    orderForm: OrderForm;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    reset: boolean
    orders: Order[]
    adminOrders: Order[];
    adminOrderDetail: Order;
    orderDetail: Order,
}

const initialState: OrderState = {
    orderForm: {
        shipping_address_id: '',
        cartItemIds: [],
        payment_method: '',
        note: ''
    },
    status: 'idle',
    reset: false,
    orders: [],
    adminOrders: [],
    adminOrderDetail: {} as Order,
    orderDetail: {} as Order
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetOrder: (state) => {
            state.reset = false;
        },
        setStatus: (state, action) => {
            state.status = action.payload
        },
        addCartItemId: (state, action) => {
            if (!state.orderForm.cartItemIds.includes(action.payload)) {
                state.orderForm.cartItemIds.push(action.payload);
            }
        },
        addShippingAddressId: (state, action) => {
            state.orderForm.shipping_address_id = action.payload
        },
        addPaymentMethod: (state, action) => {
            state.orderForm.payment_method = action.payload
        },
        addNote: (state, action) => {
            state.orderForm.note = action.payload
        },
        resetOrderForm: (state) => {
            state.orderForm = {
                shipping_address_id: '',
                cartItemIds: [],
                payment_method: '',
                note: ''
            }
        },
        resetOrderDetail: (state) => {
            state.orderDetail = {} as Order
        },
        resetAdminOrderDetail: (state) => {
            state.adminOrderDetail = {} as Order
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createOrder.pending, (state) => {
            state.status = 'loading';
        })
            .addCase(createOrder.fulfilled, (state) => {
                state.status = 'succeeded';
                state.reset = true;
            })
            .addCase(createOrder.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(fetchOrderById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orderDetail = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(fetchAdminOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAdminOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.adminOrders = action.payload;
            })
            .addCase(fetchAdminOrders.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(fetchAdminOrderById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAdminOrderById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.adminOrderDetail = action.payload;
            })
            .addCase(fetchAdminOrderById.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(updateOrderConfirm.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateOrderConfirm.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(updateOrderConfirm.rejected, (state) => {
                state.status = 'failed';
            })
    }
})

export default orderSlice.reducer

export const { setStatus, addCartItemId, addShippingAddressId, addPaymentMethod, addNote, resetOrderForm, resetOrder, resetOrderDetail, resetAdminOrderDetail } = orderSlice.actions
