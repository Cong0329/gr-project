import { createSlice } from "@reduxjs/toolkit";
import { fetchAddresses, addAddressAPI, deleteAddressAPI, updateAddressAPI, getAddressById} from "./addressAsyncThunk";
import { reset } from "./imageSlice";


// Interface cho Address
export interface Address { 
  id: string;
  name: string;
  phone: string;
  district: string;
  ward: string;
  province: string;
  street: string;
  type: string;
  default: boolean;
}


interface AddressState {
  addresses: Address[];
  selectedAddress: Address | null;
  isEdit: Address | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: AddressState = {
  addresses: [],
  selectedAddress: null,

  status: "idle",
  isEdit: null
};



// Slice quản lý địa chỉ
const addressSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    // Chọn địa chỉ từ state, ưu tiên địa chỉ mặc định
    selectAddress: (state, action) => {
      state.selectedAddress = state.addresses.find(addr => addr.id === action.payload) || state.selectedAddress;
    },

    setIsEdit: (state, action) => {
      state.isEdit = action.payload;
    },
    reset: (state) => {
      state.selectedAddress = initialState.selectedAddress;
      state.isEdit = initialState.isEdit;
      state.status = initialState.status;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload;
        state.selectedAddress = action.payload.find(addr => addr.default) || null;
        state.status = "succeeded";
      })
      .addCase(getAddressById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isEdit = action.payload;
      })
      .addCase(addAddressAPI.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
        if (action.payload.default) {
          state.selectedAddress = action.payload;
        }
      })
      .addCase(deleteAddressAPI.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
        if (state.selectedAddress?.id === action.payload) {
          state.selectedAddress = state.addresses.find(addr => addr.default) || null;
        }
      })
      .addCase(updateAddressAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAddressAPI.fulfilled, (state) => {
        state.status = "succeeded";
      });
  },
});

export const { selectAddress, setIsEdit, reset: resetAddress } = addressSlice.actions;
export default addressSlice.reducer;
