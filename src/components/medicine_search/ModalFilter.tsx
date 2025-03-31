import { useState, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { toggleFilter, clearFilters } from "../../redux/filterSlice"; // Vẫn dùng toggleFilter
import ModalFilterSelected from "./ModalFilterSelected";

interface ModalFilterProps {
  isOpen: boolean;
  onClose: () => void;
}

const filterOptions: { [key: string]: string[] } = {
  "Loại sản phẩm": ["Kem dưỡng", "Sữa rửa mặt", "Tinh chất", "Serum"],
  "Đối tượng sử dụng": ["Nam", "Nữ", "Trẻ em", "Người lớn"],
  "Giá bán": ["100k - 500k", "500k - 1 triệu", "Trên 1 triệu"],
  "Loại thuốc": ["Thuốc bôi", "Thuốc uống", "Thuốc tiêm"],
  "Nước sản xuất": ["Việt Nam", "Hàn Quốc", "Nhật Bản", "Mỹ"],
  "Chỉ định": ["Trị mụn", "Dưỡng trắng", "Dưỡng ẩm"],
  "Thương hiệu": ["La Roche-Posay", "Bioderma", "Vichy", "CeraVe"],
  "Xuất xứ thương hiệu": ["Việt Nam", "Hàn Quốc", "Pháp", "Mỹ"],
};

export const ModalFilter: React.FC<ModalFilterProps> = ({ isOpen, onClose }) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dispatch = useDispatch();

  const selectedFilters = useSelector((state: RootState) => state.filters.selectedFilters);

  // State tạm để giữ các bộ lọc chưa áp dụng
  const [tempSelectedFilters, setTempSelectedFilters] = useState<typeof selectedFilters>({});

  // Khi mở modal, sao chép selectedFilters vào tempSelectedFilters
  useEffect(() => {
    if (isOpen) {
      setTempSelectedFilters(JSON.parse(JSON.stringify(selectedFilters))); // Clone dữ liệu
    }
  }, [isOpen, selectedFilters]);

  // Hàm chọn/bỏ chọn filter (tách logic toggleFilter ra ngoài Redux)
  const handleToggleFilter = (category: string, value: string) => {
    const newFilters = { ...tempSelectedFilters };

    // Dùng chính logic từ toggleFilter Redux
    if (category === "Giá bán") {
      newFilters[category] = newFilters[category]?.includes(value) ? [] : [value];
    } else if (value === "Tất cả") {
      newFilters[category] = ["Tất cả"];
    } else {
      let newSelected = [...(newFilters[category] || [])];

      if (newSelected.includes("Tất cả")) {
        newSelected = newSelected.filter((item) => item !== "Tất cả");
      }

      if (newSelected.includes(value)) {
        newSelected = newSelected.filter((item) => item !== value);
      } else {
        newSelected.push(value);
      }

      if (newSelected.length === 0) {
        newSelected = ["Tất cả"];
      }

      newFilters[category] = newSelected;
    }

    setTempSelectedFilters(newFilters);
  };

  // Nhấn "Áp dụng" -> Gửi dữ liệu vào Redux
  const handleApplyFilters = () => {
    // Xóa toàn bộ filter trong Redux trước
    dispatch(clearFilters());
  
    // Sau đó, cập nhật lại từ tempSelectedFilters
    Object.entries(tempSelectedFilters).forEach(([category, values]) => {
      values.forEach((value) => {
        dispatch(toggleFilter({ category, value }));
      });
    });
  
    onClose();
  };
  
  

  // Tắt modal -> Khôi phục bộ lọc cũ
  const handleCloseWithoutApply = () => {
    setTempSelectedFilters(JSON.parse(JSON.stringify(selectedFilters))); // Reset về ban đầu
    onClose();
  };
  
  const handleResetFilters = () => {
    setTempSelectedFilters({}); // Reset về khóa
    onClose();
    dispatch(clearFilters());
  };

  return (
    <Sheet isOpen={isOpen} onClose={handleCloseWithoutApply}>
      <Sheet.Container>
        <div className="flex items-center justify-between font-medium text-xl border-b p-4">
          {activeFilter ? (
            <>
              <button onClick={() => { setActiveFilter(null); setSearchTerm(""); }} className="mr-2 text-xl">←</button>
              <p className="text-center flex-grow">{activeFilter}</p>
            </>
          ) : (
            <>
              <p className="text-center flex-grow">Bộ lọc nâng cao</p>
              <button onClick={handleCloseWithoutApply} className="text-gray-500 flex-none">✖</button>
            </>
          )}
        </div>

        <Sheet.Content>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4">
              {activeFilter ? (
                <>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md mb-3"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions[activeFilter]
                      .filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((item) => (
                        <button
                          key={item}
                          className={`p-2 border rounded-md ${
                            tempSelectedFilters[activeFilter]?.includes(item) ? "bg-blue-500 text-white" : ""
                          }`}
                          onClick={() => handleToggleFilter(activeFilter, item)}
                        >
                          {item}
                        </button>
                      ))}
                  </div>
                </>
              ) : (
                <>
                  {Object.keys(filterOptions).map((category) => (
                    <div key={category} className="mb-4">
                      <h3 className="font-semibold">{category}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {filterOptions[category].slice(0, 2).map((item) => (
                          <button
                            key={item}
                            className={`p-2 border rounded-md ${
                              tempSelectedFilters[category]?.includes(item) ? "bg-blue-500 text-white" : ""
                            }`}
                            onClick={() => handleToggleFilter(category, item)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                      {filterOptions[category].length > 2 && (
                        <button className="text-blue-500 mt-2" onClick={() => setActiveFilter(category)}>
                          Xem tất cả &gt;
                        </button>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="sticky bottom-0 left-0 bg-white px-4 py-2 border-t">
              <div><ModalFilterSelected tempSelectedFilters={tempSelectedFilters} setTempSelectedFilters={setTempSelectedFilters} /></div>
              <div className="flex justify-between w-full gap-4 font-medium">
                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full w-1/2" onClick={handleResetFilters}>
                  Thiết lập lại
                </button>
                <button className="px-4 py-2 bg-blue-700 text-white rounded-full w-1/2" onClick={handleApplyFilters}>
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
};
