import { useState } from "react";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  package: string;
}

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
  { id: "cold", name: "Phòng cảm mạo" },
];

const products: Record<string, Product[]> = {
  exclusive: [
    {
      id: 1,
      name: "Viên uống CalcK K-2",
      image: "/images/product1.png",
      price: 400000,
      oldPrice: 470000,
      discount: 20,
      package: "Hộp 60 Viên",
    },
    {
      id: 2,
      name: "Viên uống Natto Gold",
      image: "/images/product2.png",
      price: 295000,
      package: "Hộp 60 Viên",
    },
    {
      id: 3,
      name: "Viên uống KenKan Natokinase",
      image: "/images/product3.png",
      price: 515000,
      package: "Hộp 60 Viên",
    },
  ],
  trending: [
    {
      id: 4,
      name: "Sữa bột người lớn Ensure Gold",
      image: "/images/product4.png",
      price: 850000,
      package: "Hộp 900g",
    },
  ],
};

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("exclusive");

  return (
    <div className="w-4/5 mx-auto bg-gray-100 mt-5 p-4 rounded-xl">
      {/* Tiêu đề */}
      <div className="flex items-center gap-2 mb-4 text-black font-bold text-lg">
        <span className="text-blue-600 text-2xl">⏰</span> Gợi ý hôm nay
      </div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-full border ${selectedCategory === category.id
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
      <div className="grid grid-cols-4 gap-4">
        {products[selectedCategory]?.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative"
          >
            {product.discount && (
              <span className="absolute bg-red-500 text-white text-xs px-2 py-1 rounded-tl-lg">
                -{product.discount}%
              </span>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-contain"
            />
            <p className="font-bold text-black mt-2">{product.name}</p>
            <p className="text-blue-600 text-lg font-semibold">
              {product.price.toLocaleString()}đ / Hộp
            </p>
            {product.oldPrice && (
              <p className="text-gray-400 line-through text-sm">
                {product.oldPrice.toLocaleString()}đ
              </p>
            )}
            <p className="text-gray-500 text-xs bg-gray-200 px-2 py-1 inline-block rounded">
              {product.package}
            </p>
            <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md">
              Chọn mua
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
