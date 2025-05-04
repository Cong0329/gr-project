import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCarts, addToCartAPI, updateQuantityAPI, removeFromCartAPI, updateSelectedOptionAPI } from "./cartAsyncThunk";

// Các interface cần thiết
export interface ProductOption {
  id: string;
  label: string;
  price: number;
  discountedPrice?: number;
  isDiscounted?: boolean;
}

export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  image: string;
  quantity: number;
  selectedOption: ProductOption | string;
  selected: boolean;
}

interface CartState {
  items: CartItem[];
  isCheckout: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  loading: boolean;
}

// Initial state của giỏ hàng
const initialState: CartState = {
  items: [],
  isCheckout: false,
  status: "idle",
  loading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateSelectedOption: (state, action: PayloadAction<{ id: string; selectedOption: ProductOption }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.selectedOption = action.payload.selectedOption;
      }
    },
    toggleSelectItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.selected = !item.selected;
      }
    },
    toggleSelectAll: (state, action: PayloadAction<boolean>) => {
      state.items.forEach((item) => {
        item.selected = action.payload;
      });
    },
    initializeCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    goToCheckout: (state) => {
      state.isCheckout = true;
    },
    backToCart: (state) => {
      state.isCheckout = false;
    },
    checkout: (state,action) => {
      state.isCheckout = action.payload;
    },
    resetCart: (state) => {
      state.items = [];
      state.isCheckout = false;
      state.status = "idle";
      state.loading = false;
      
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCarts.fulfilled, (state, action) => {
        state.status = "idle";
        state.loading = true;
        // state.items = action.payload.items;
        // Tạo map để tra cứu trạng thái `selected` từ Redux Persist
        const selectedMap = state.items.reduce((acc, item) => {
          acc[item.id] = item.selected;
          return acc;
        }, {} as Record<string, boolean>);
      
        // Cập nhật danh sách sản phẩm, giữ lại `selected` nếu tồn tại
        state.items = action.payload.items.map((product: CartItem) => ({
          id: String(product.id),
          product_id: String(product.product.id),
          name: product.product.name,
          image: product.product.images[0].image,
          quantity: product.quantity,
          selectedOption: product.option,
          selected: selectedMap[product.id] ?? true, // 🔥 Giữ trạng thái cũ hoặc mặc định `false`
        }));
      })      
      .addCase(fetchCarts.rejected, (state, action) => {
        state.status = "failed";
        console.error(action.payload);
      })
      .addCase(addToCartAPI.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(addToCartAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCartAPI.rejected, (state, action) => {
        state.status = "failed";
        console.error(action.payload);
      })
      .addCase(updateQuantityAPI.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateQuantityAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateQuantityAPI.rejected, (state, action) => {
        state.status = "failed";
        console.error(action.payload);
      })
      .addCase(removeFromCartAPI.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(removeFromCartAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromCartAPI.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateSelectedOptionAPI.fulfilled, (state) => {
       state.status = "succeeded";
      })
      .addCase(updateSelectedOptionAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSelectedOptionAPI.rejected, (state) => {
        state.status = "failed";
      });
      
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  toggleSelectItem,
  toggleSelectAll,
  goToCheckout,
  backToCart,
  updateSelectedOption,
  initializeCart,
  checkout,
  resetCart
} = cartSlice.actions;

export default cartSlice.reducer;
