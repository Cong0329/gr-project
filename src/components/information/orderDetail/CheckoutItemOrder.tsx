
import Skeleton from "react-loading-skeleton";
import { OrderItem } from "../../../redux/orderSlice";

interface CheckoutItemProps {
  item: OrderItem;
  isFirst: boolean;
  isLoading?: boolean | null;
}

export const CheckoutItemOrder: React.FC<CheckoutItemProps> = ({ isFirst, item, isLoading }) => {
  // Tính tổng tiền của sản phẩm dựa trên tùy chọn được chọn
  const totalPrice = parseFloat(item.price as string).toLocaleString();

  // Hàm cập nhật tùy chọn cho sản phẩm
  let content;

  if (isLoading) {
    content = (
      <div className={`flex items-center justify-between ${isFirst ? "border-none" : "border-t"} border-gray-300 py-4 text-black gap-x-2 animate-pulse`}>
        <div className="flex items-center gap-x-2">
          {/* Product image skeleton */}
          <div className="w-16 h-16 rounded-xl bg-gray-200">
            <Skeleton />
          </div>

          {/* Product name skeleton */}
          <div className="w-60 md-lg:w-52 h-10 max-h-10 ms:w-44 mm:w-32 bg-gray-200 rounded">
            <Skeleton />
          </div>
        </div>

        {/* Price skeleton (shown on mobile) */}
        <div className="text-black h-5 w-24 bg-gray-200 rounded ml:hidden">
          <Skeleton />
        </div>

        {/* Quantity skeleton */}
        <div className="text-gray-500 flex items-center gap-1">
          <div className="h-5 w-20 bg-gray-200 rounded ml-1">
            <Skeleton />
          </div>
        </div>
      </div>

    )
  } else {
    content = (
      <div className={`flex items-center justify-between ${isFirst ? "border-none" : "border-t"} border-gray-300 py-4 text-black gap-x-2`}>
        <div className="flex items-center gap-x-2">
          <img src={item.product.images[0].image} alt={item.product.name} className="w-16 h-16 rounded-xl border p-1" />
          <div>
            <p
              className="text-sm text-left w-60 md-lg:w-52 overflow-hidden h-5 max-h-5 ms:w-44 mm:w-32"
              title={item.product.name}
            >
              {item.product.name}
            </p>
            <p className="text-black hidden ml:block  font-semibold text-sm">{totalPrice.toLocaleString()}đ</p>

          </div>

        </div>

        <p className="text-black  font-semibold text-sm ml:hidden">{totalPrice.toLocaleString()}đ</p>
        <div className="text-gray-500 flex font-semibold text-sm">
          <span>x</span>
          <p className="">{item.quantity}</p>
          <p className="ml-1">{item.option}</p>
        </div>
      </div>
    )
  }

  return (
    <div>{content}</div>
  );
};


