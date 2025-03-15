import { useState, useEffect } from "react";
import products from "./medical";
import { Medicine } from "../medicines/medicine";

interface Category {
  id: string;
  name: string;
}

const categories: Category[] = [
  { id: "exclusive", name: "Đặc quyền" },
  { id: "trending", name: "Tìm kiếm nhiều" },
  { id: "new", name: "Sản phẩm mới" },
  { id: "family", name: "Sữa cho cả nhà" },
  { id: "vitamin", name: "Vitamin tổng hợp" },
  { id: "beauty", name: "Da sáng dáng xinh" },
  { id: "cold", name: "Phòng cúm mùa" },
];



export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("exclusive");
  const [selectedTypes, setSelectedTypes] = useState({});
  useEffect(() => {
    // Đặt giá trị mặc định cho loại đầu tiên của mỗi sản phẩm
    const defaultTypes: Record<string, string> = {};
    products[selectedCategory].forEach(product => {
      defaultTypes[product.id] = product.type[0]; // Chọn loại đầu tiên
    });
    setSelectedTypes(defaultTypes);
  }, []);

  const handleTypeClick = (type: string, id: string) => {
    // Cập nhật loại được chọn cho sản phẩm tương ứng
    setSelectedTypes((prev) => ({ ...prev, [id]: type }));
  };
  return (
    <div className="w-4/5 md-lg:w-11/12 container mx-auto bg-gray-100 mt-5  rounded-xl">
      {/* Tiêu đề */}
      <div className="flex items-center gap-2 mb-4 text-black font-bold text-lg">
        <span className="text-blue-600 text-2xl">⏰</span> Gợi ý hôm nay
      </div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white p-3 rounded-lg">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 md-lg:text-sm md-lg:px-3 tb: rounded-full border ${selectedCategory === category.id
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black"
              }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Danh sách sản phẩm */}
      <div className="grid grid-cols-6 gap-4 tb:grid-cols-2">
        {products[selectedCategory]?.slice(0,12).map((product) => (
          <Medicine key={product.id} medicine={product} handleTypeClick={handleTypeClick} selectedType={selectedTypes} />
        ))}
      </div>
    </div>
  );
}
