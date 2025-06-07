
import Skeleton from "react-loading-skeleton";
import { ProductOption } from "../../redux/cartSlice";
import { useDispatch } from "react-redux";
import { addCartItemId } from "../../redux/orderSlice";
import { useEffect } from "react";

interface CheckoutItem {
  id: string;
  name: string;
  quantity: number;
  image: string;
  selected: boolean;
  selectedOption: ProductOption | string; // Thêm `selectedOption` vào item
}

interface CheckoutItemProps {
  item: CheckoutItem;
  isFirst: boolean;
  isLoading?: boolean | null;
}

export const CheckoutItem: React.FC<CheckoutItemProps> = ({ isFirst, item, isLoading }) => {
  const { name, quantity, image, selectedOption } = item;
  const dispatch = useDispatch();
  useEffect(() => {
    if (item.selected) {
      dispatch(addCartItemId(Number(item.id)));
    }
  }, [dispatch, item]);
  
  // Tính tổng tiền của sản phẩm dựa trên tùy chọn được chọn
  const totalPrice = (typeof selectedOption === 'string' ? 0 : (selectedOption.discounted_price ?? selectedOption.price)) * quantity;

  // Hàm cập nhật tùy chọn cho sản phẩm
  let content;

  if (isLoading) {
    content = (
      <div className={`flex items-center justify-between ${isFirst ? "border-t" : "border-none"} border-gray-300 py-4 text-black gap-x-2 animate-pulse`}>
        <div className="flex items-center gap-x-2">
          {/* Product image skeleton */}
          <Skeleton className="w-16 h-16 rounded-xl  bg-gray-200"></Skeleton>


          {/* Product name skeleton */}
          <Skeleton className=" w-60 md-lg:w-52 h-10 max-h-10 ms:w-44 mm:w-32 bg-gray-200 rounded"></Skeleton>


        </div>

        {/* Price skeleton (shown on mobile) */}
        <Skeleton className="text-black h-5 w-24 bg-gray-200 rounded ml:hidden"></Skeleton>

        {/* Quantity skeleton */}
        <div className="text-gray-500 flex items-center gap-1">
          <Skeleton className="h-5 w-20 bg-gray-200 rounded ml-1"></Skeleton>
        </div>
      </div>
    )
  } else {
    content = (
      <div className={`flex items-center justify-between ${isFirst ? "border-t" : "border-none"} border-gray-300 py-4 text-black gap-x-2`}>
        <div className="flex items-center gap-x-2">
          <img src={image} alt={name} className="w-16 h-16 rounded-xl border p-1" />
          <div>
            <p
              className="text-sm text-left w-60 md-lg:w-52 overflow-hidden h-5 max-h-5 ms:w-44 mm:w-32"
              title={name}
            >
              {name}
            </p>
            <p className="text-black hidden ml:block  font-semibold text-sm">{totalPrice.toLocaleString()}đ</p>

          </div>

        </div>

        <p className="text-black  font-semibold text-sm ml:hidden">{totalPrice.toLocaleString()}đ</p>
        <div className="text-gray-500 flex font-semibold text-sm">
          <span>x</span>
          <p className="">{quantity}</p>
          <p className="ml-1">{typeof selectedOption === 'string' ? selectedOption : selectedOption.label}</p>
        </div>
      </div>
    )
  }

  return (
    <div>{content}</div>
  );
};


