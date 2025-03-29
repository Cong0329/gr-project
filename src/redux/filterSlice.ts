import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  selectedFilters: { [key: string]: string[] };
}

const initialState: FilterState = {
  selectedFilters: {
   "Loại sản phẩm": ["Tất cả"],
    "Đối tượng sử dụng": ["Tất cả"],
    "Giá bán": [], // Giá bán không mặc định chọn "Tất cả" vì nó chỉ chọn 1 giá trị
    "Loại thuốc": ["Tất cả"],
    "Loại da": ["Tất cả"],
    "Nước sản xuất": ["Tất cả"],
    "Chỉ định": ["Tất cả"],
    "Thương hiệu": ["Tất cả"],
    "Xuất xứ thương hiệu": ["Tất cả"],
  },
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    toggleFilter: (state, action: PayloadAction<{ category: string; value: string }>) => {
      const { category, value } = action.payload;
      const selected = state.selectedFilters[category] || [];
  
      if (category === "Giá bán") {
          // Nếu giá đã được chọn, thì bỏ chọn
          if (selected.includes(value)) {
              state.selectedFilters[category] = [];
          } else {
              state.selectedFilters[category] = [value];
          }
          return;
      }
  
      if (value === "Tất cả") {
          // Nếu chọn "Tất cả", bỏ hết các lựa chọn khác và chỉ chọn "Tất cả"
          state.selectedFilters[category] = ["Tất cả"];
      } else {
          // Nếu chọn một giá trị khác
          let newSelected = [...selected];
  
          // Nếu "Tất cả" đang được chọn, bỏ chọn "Tất cả"
          if (newSelected.includes("Tất cả")) {
              newSelected = newSelected.filter((item) => item !== "Tất cả");
          }
  
          // Nếu giá trị đã tồn tại, bỏ chọn nó, nếu chưa thì thêm vào
          if (newSelected.includes(value)) {
              newSelected = newSelected.filter((item) => item !== value);
          } else {
              newSelected.push(value);
          }
  
          // Nếu không có giá trị nào được chọn, chọn lại "Tất cả"
          if (newSelected.length === 0) {
              newSelected = ["Tất cả"];
          }
  
          state.selectedFilters[category] = newSelected;
      }
  },

  removeFilter: (state, action: PayloadAction<{ category: string; value: string }>) => {
    const { category, value } = action.payload;
    state.selectedFilters[category] = state.selectedFilters[category].filter((item) => item !== value);

    // Nếu không còn giá trị nào, đặt lại thành "Tất cả"
    if (state.selectedFilters[category].length === 0) {
      state.selectedFilters[category] = ["Tất cả"];
    }
  },
  clearFilters: (state) => {
    Object.keys(state.selectedFilters).forEach((key) => {
      state.selectedFilters[key] = ["Tất cả"];
    });
  },
  },
});

export const { toggleFilter, clearFilters, removeFilter } = filterSlice.actions;
export default filterSlice.reducer;
