import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  selectedFilters: { [key: string]: string[] };
}

const initialState: FilterState = {
  selectedFilters: {
    "Loại sản phẩm": [],
    "Đối tượng sử dụng": [],
    "Giá bán": [],
    "Loại thuốc": [],
    "Loại da": [],
    "Nước sản xuất": [],
    "Chỉ định": [],
    "Thương hiệu": [],
    "Xuất xứ thương hiệu": [],
  },
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    toggleFilter: (state, action: PayloadAction<{ category: string; value: string }>) => {
        const { category, value } = action.payload;
        
        if (category === "Giá bán") {
          // Nếu giá đã được chọn, thì bỏ chọn
          if (state.selectedFilters[category].includes(value)) {
            state.selectedFilters[category] = [];
          } else {
            state.selectedFilters[category] = [value];
          }
        } else {
          const selected = state.selectedFilters[category] || [];
          if (selected.includes(value)) {
            state.selectedFilters[category] = selected.filter((item) => item !== value);
          } else {
            state.selectedFilters[category] = [...selected, value];
          }
        }
      },
    resetFilters: (state) => {
      state.selectedFilters = initialState.selectedFilters;
    },
  },
});

export const { toggleFilter, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
