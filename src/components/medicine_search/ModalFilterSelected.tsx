interface ModalFilterSelectedProps {
    tempSelectedFilters: Record<string, string[]>;
    setTempSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  }
  
  const ModalFilterSelected: React.FC<ModalFilterSelectedProps> = ({ tempSelectedFilters, setTempSelectedFilters }) => {
    // Xóa một filter trong danh mục
    const handleRemoveFilter = (category: string, value: string) => {
      setTempSelectedFilters((prev) => {
        const updatedCategory = prev[category]?.filter((item) => item !== value) || [];
        const newFilters = { ...prev, [category]: updatedCategory };
        
        // Nếu danh mục không còn giá trị nào, xóa luôn nó
        if (updatedCategory.length === 0) {
          delete newFilters[category];
        }
  
        return newFilters;
      });
    };
  
    // Xóa toàn bộ filter tạm thời
    const handleClearFilters = () => {
      setTempSelectedFilters({});
    };
  
    // Lấy danh sách filter đã chọn, bỏ "Tất cả"
    const activeFilters = Object.entries(tempSelectedFilters).flatMap(([category, values]) =>
      values.includes("Tất cả") ? [] : values.map((value) => ({ category, value }))
    );
  
    if (activeFilters.length === 0) return null; // Không hiển thị nếu không có bộ lọc nào
  
    return (
      <div className="bg-white pb-2.5 rounded-lg flex items-center space-x-2 tb:text-sm overflow-x-auto whitespace-nowrap px-2 scrollbar-hide">
        <span className="font-medium text-gray-600 flex-shrink-0">
          Lọc theo ({activeFilters.length})
        </span>
  
        <div className="flex space-x-2">
          {activeFilters.map(({ category, value }) => (
            <span
              key={`${category}-${value}`}
              className="bg-gray-200 px-2 py-1 rounded-full flex items-center space-x-1 font-medium flex-shrink-0"
            >
              {value}
              <button
                onClick={() => handleRemoveFilter(category, value)}
                className="text-gray-600 hover:text-red-500 pl-2"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
  
        {activeFilters.length > 0 && (
          <button
            onClick={handleClearFilters}
            className="text-blue-600 font-medium flex-shrink-0"
          >
            Xóa tất cả
          </button>
        )}
      </div>
    );
  };
  
  export default ModalFilterSelected;
  