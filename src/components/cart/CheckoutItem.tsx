
import { ProductOption } from "./product";

interface CheckoutItem {
  id: string;
  name: string;
  quantity: number;
  image: string;
  selected: boolean;
  selectedOption: ProductOption; // Thêm `selectedOption` vào item
  options: ProductOption[]; // Thêm `options` vào item
}

interface CheckoutItemProps {
  item: CheckoutItem;
  isFirst: boolean;
}

export const CheckoutItem: React.FC<CheckoutItemProps> = ({ isFirst, item }) => {
  const { name, quantity, image, selectedOption } = item;

  // Tính tổng tiền của sản phẩm dựa trên tùy chọn được chọn
  const totalPrice = (selectedOption.discountedPrice ?? selectedOption.price) * quantity;

  // Hàm cập nhật tùy chọn cho sản phẩm


  return (
    <div className={`flex items-center justify-between ${isFirst ? "border-t" : "border-none"} border-gray-300 py-4 text-black gap-x-2`}>
      <div className="flex items-center gap-x-2">
        <img src={image} alt={name} className="w-16 h-16 rounded-xl border p-1" />
        <p className="text-sm text-left w-[400px]">{name}</p>
      </div>

      <p className="text-black  font-semibold text-sm">{totalPrice.toLocaleString()}đ</p>
      <div className="text-gray-500 flex font-semibold text-sm">
        <span>x</span>
        <p className="">{quantity}</p>
        <p className="ml-1">{selectedOption.label}</p>
      </div>
    </div>
  );
};


