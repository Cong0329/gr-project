import { useEffect, useState } from 'react';
import { Medicine } from '../home/medicines/Medicine';
import FilterSelected from './FilterSelected';
import { FaAngleDoubleDown } from 'react-icons/fa';


interface PromotionProps {
  id: string;
  name: string;
  image: string;
  price: number;
  type: string[];
}

const ProductGrid = () => {
  const medicines: PromotionProps[] = [
    { id: '1', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 1000000, type: ['hộp', 'vỉ', 'viên'] },
    { id: '2', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 200000, type: ['hộp', 'vỉ', 'viên'] },
    { id: '3', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/VoWEXd6.png', price: 300000, type: ['hộp', 'vỉ'] },
    { id: '4', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 3000000, type: ['hộp', 'vỉ', 'viên'] },
    { id: '5', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 300000, type: ['hộp', 'vỉ'] },
    { id: '6', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
    { id: '7', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
    { id: '8', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
    { id: '9', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
    { id: '10', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
    { id: '11', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
    { id: '12', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
  ]
  const [selectedTypes, setSelectedTypes] = useState({});
  
  const [visibleCount, setVisibleCount] = useState(4); // Số sản phẩm hiển thị ban đầu
 
  const loadMore = () => {
    setVisibleCount((prev) => prev + 4); // Mỗi lần load thêm 6 sản phẩm
  };
  useEffect(() => {
    // Đặt giá trị mặc định cho loại đầu tiên của mỗi sản phẩm
    const defaultTypes: Record<string, string> = {};
    medicines.forEach(product => {
      defaultTypes[product.id] = product.type[0]; // Chọn loại đầu tiên
    });
    setSelectedTypes(defaultTypes);
  }, []);

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

        {medicines.slice(0, visibleCount).map((medicine) => (
          
            <Medicine key={medicine.id} medicine={medicine} handleTypeClick={handleTypeClick} selectedType={selectedTypes} />
       
        ))}


      </div>

      {/* Xem thêm */}
      {visibleCount < medicines.length && (
        <button
          onClick={loadMore}
          className="mt-4  px-4 py-2 w-full flex items-center gap-2 rounded justify-center transition"
        >
          <FaAngleDoubleDown/>
          Xem thêm
        </button>
      )}
    </div>
  );
};

export default ProductGrid;
