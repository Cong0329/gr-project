import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "./../../redux/store";
import { clearFilters, removeFilter } from "./../../redux/filterSlice";

const FilterSelected: React.FC = () => {
   const dispatch = useDispatch();
    const selectedFilters = useSelector((state: RootState) => state.filters.selectedFilters);

  // Lấy danh sách filter đã chọn, bỏ "Tất cả"
  const activeFilters = Object.entries(selectedFilters).flatMap(([category, values]) =>
    values.includes("Tất cả") ? [] : values.map((value) => ({ category, value }))
  );

  if (activeFilters.length === 0) return null; // Không hiển thị nếu không có bộ lọc nào

  return (
    <div className="bg-white p-2 rounded-lg flex flex-wrap items-center space-x-2 space-y-2 mt-2">
      <span className="font-medium text-gray-600">Lọc theo ({activeFilters.length})</span>
      {activeFilters.map(({ category, value }) => (
        <span
          key={`${category}-${value}`}
          className="bg-gray-200 px-2 py-1 rounded-full flex items-center space-x-1 font-medium"
        >
          {value}
          <button
            onClick={() => dispatch(removeFilter({ category, value }))}
            className="text-gray-600 hover:text-red-500 pl-2"
          >
            ✕
          </button>
        </span>
      ))}
      <button onClick={() => dispatch(clearFilters())} className="text-blue-600 font-medium">
        Xóa tất cả
      </button>
    </div>
  );
};

export default FilterSelected;
