import ProductCard from "./MedicineCard";

export interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
}

const products = [
  { id: 1, name: "Viên uống NutriGrow", price: "480.000đ", image: "/path-to-image.jpg" },
  { id: 2, name: "Siro uống Canxi", price: "105.000đ", image: "/path-to-image.jpg" },
  { id: 3, name: "Viên uống Anica", price: "560.000đ", image: "/path-to-image.jpg" },
];

const ProductGrid = () => {
  return (
    <div>
      <h2 className="font-semibold text-xl">Danh sách sản phẩm</h2>
      
      <div className="grid grid-cols-4 gap-4 mt-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Xem thêm */}
      <div className="text-center mt-6">
        <button className="px-4 py-2 bg-gray-200 rounded-lg">Xem thêm</button>
      </div>
    </div>
  );
};

export default ProductGrid;
