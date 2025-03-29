import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./../../redux/store";
import { toggleFilter } from "./../../redux/filterSlice";
import FilterItem from "./FilterSection";

const FilterSideBar: React.FC = () => {
  const dispatch = useDispatch();
  const selectedFilters = useSelector((state: RootState) => state.filters.selectedFilters);

  const handleFilterChange = (category: string, value: string) => {
    dispatch(toggleFilter({ category, value }));
  };

  return (
    <div className="w-80 p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="font-semibold text-lg flex items-center space-x-2">
        <span>🛠️</span> <span>Bộ lọc nâng cao</span>
      </h2>
      <div className="mt-4 space-y-4">
        <FilterItem
          title="Loại sản phẩm"
          options={["Tất cả", "Thuốc tim mạch huyết áp", "Dầu cá, Omega 3, DHA", "Sữa", "Thuốc trị mỡ máu"]}
          selected={selectedFilters["Loại sản phẩm"]}
          onChange={(value) => handleFilterChange("Loại sản phẩm", value)}
        />
        <FilterItem
          title="Đối tượng sử dụng"
          options={["Tất cả", "Người cao tuổi", "Trẻ em", "Người lớn", "Phụ nữ có thai"]}
          hasSearch
          selected={selectedFilters["Đối tượng sử dụng"]}
          onChange={(value) => handleFilterChange("Đối tượng sử dụng", value)}
        />
        <FilterItem
          title="Giá bán"
          options={["Dưới 100.000đ", "100.000đ - 300.000đ", "300.000đ - 500.000đ", "Trên 500.000đ"]}
          selected={selectedFilters["Giá bán"]}
          onChange={(value) => handleFilterChange("Giá bán", value)}
        />
        <FilterItem
          title="Loại thuốc"
          options={["Tất cả", "Thuốc kê đơn", "Thuốc không kê đơn"]}
          selected={selectedFilters["Loại thuốc"]}
          onChange={(value) => handleFilterChange("Loại thuốc", value)}
        />
        <FilterItem
          title="Loại da"
          options={["Tất cả", "Da dầu", "Da khô", "Da nhạy cảm"]}
          selected={selectedFilters["Loại da"]}
          onChange={(value) => handleFilterChange("Loại da", value)}
        />
        <FilterItem
          title="Nước sản xuất"
          options={["Tất cả", "Việt Nam", "Hoa Kỳ", "Ấn Độ", "Thái Lan"]}
          hasSearch
          selected={selectedFilters["Nước sản xuất"]}
          onChange={(value) => handleFilterChange("Nước sản xuất", value)}
        />
        <FilterItem
          title="Chỉ định"
          options={["Tất cả", "Cao huyết áp", "Cholesterol máu cao", "Cơn đau thắt ngực", "Mỡ máu"]}
          hasSearch
          selected={selectedFilters["Chỉ định"]}
          onChange={(value) => handleFilterChange("Chỉ định", value)}
        />
        <FilterItem
          title="Thương hiệu"
          options={["Tất cả", "MEGA We care", "Dược 3-2", "OMEXXEL", "Stella Pharm"]}
          hasSearch
          selected={selectedFilters["Thương hiệu"]}
          onChange={(value) => handleFilterChange("Thương hiệu", value)}
        />
        <FilterItem
          title="Xuất xứ thương hiệu"
          options={["Tất cả", "Việt Nam", "Thái Lan", "Hoa Kỳ", "Úc"]}
          hasSearch
          selected={selectedFilters["Xuất xứ thương hiệu"]}
          onChange={(value) => handleFilterChange("Xuất xứ thương hiệu", value)}
        />
      </div>
    </div>
  );
};

export default FilterSideBar;
