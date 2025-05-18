import { useEffect, useState } from 'react';
import FilterSelected from './FilterSelected';
import { FaAngleDoubleDown } from 'react-icons/fa';
import { Product } from '../../redux/searchSlice';
import { PromotionChild } from '../home/promotion/PromotionChild';




const ProductGrid = ({ products }: { products: Product[] }) => {

  const [selectedTypes, setSelectedTypes] = useState({});

  const [visibleCount, setVisibleCount] = useState(4); // Số sản phẩm hiển thị ban đầu

  const loadMore = () => {
    setVisibleCount((prev) => prev + 4); // Mỗi lần load thêm 6 sản phẩm
  };
  useEffect(() => {
    // Đặt giá trị mặc định cho loại đầu tiên của mỗi sản phẩm
    const defaultTypes: Record<string, string> = {};
    products.forEach(product => {
      defaultTypes[product.id] = product.options[0].label; // Chọn loại đầu tiên
    });
    setSelectedTypes(defaultTypes);
  }, [products]);

  const handleTypeClick = (type: string, id: string) => {
    // Cập nhật loại được chọn cho sản phẩm tương ứng
    setSelectedTypes((prev) => ({ ...prev, [id]: type }));
  };


  return (
    <div>
      <div>
        <FilterSelected />
      </div>

      <div className="grid grid-cols-4 gap-4 mt-4 tb:grid-cols-2 tb:gap-2">

        {products.slice(0, visibleCount).map((product) => (

          <PromotionChild key={product.id} product={product} handleTypeClick={handleTypeClick} selectedType={selectedTypes} />

        ))}


      </div>

      {/* Xem thêm */}
      {visibleCount < products.length && (
        <button
          onClick={loadMore}
          className="mt-4  px-4 py-2 w-full flex items-center gap-2 rounded justify-center transition"
        >
          <FaAngleDoubleDown />
          Xem thêm
        </button>
      )}
    </div>
  );
};

export default ProductGrid;
