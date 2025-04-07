import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchProducts, addToCartAPI, updateQuantityAPI, removeFromCartAPI, updateSelectedOptionAPI } from "./cartAsyncThunk";

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
  name: string;
  image: string;
  quantity: number;
  options: ProductOption[];
  selectedOption: ProductOption | string;
  selected: boolean;
}

interface CartState {
  items: CartItem[];
  isCheckout: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
}

// Initial state của giỏ hàng
const initialState: CartState = {
  items: [],
  isCheckout: false,
  status: "idle",
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
      
        // Tạo map để tra cứu trạng thái `selected` từ Redux Persist
        const selectedMap = state.items.reduce((acc, item) => {
          acc[item.id] = item.selected;
          return acc;
        }, {} as Record<string, boolean>);
      
        // Cập nhật danh sách sản phẩm, giữ lại `selected` nếu tồn tại
        state.items = action.payload.map((product: CartItem) => ({
          id: String(product.id),
          name: product.name,
          image: product.image,
          quantity: product.quantity,
          options: product.options,
          selectedOption:
            product.options.find((option) => option.id === product.selectedOption) ||
            product.options[0],
          selected: selectedMap[product.id] ?? true, // 🔥 Giữ trạng thái cũ hoặc mặc định `false`
        }));
      })      
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        console.error(action.payload);
      });

    builder
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateQuantityAPI.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index].quantity = action.payload.quantity;
        }
      })
      .addCase(removeFromCartAPI.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload.id);
      })
      .addCase(updateSelectedOptionAPI.fulfilled, (state, action) => {
        const item = state.items.find(item => item.id === action.payload.id);
        if (item) {
          const selected = item.options.find(option => option.id === action.payload.selectedOption) || item.options[0];
          item.selectedOption = selected; // ✅ Gán đúng giá trị
        }
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
