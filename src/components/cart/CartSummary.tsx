import { useDispatch, useSelector } from "react-redux";
import { goToCheckout } from "../../redux/cartSlice";
import { RootState } from "../../redux/store";
import { FaAngleRight, FaQuestion } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { VoucherModal } from "./VoucherModal";

const CartSummary: React.FC = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isCheckout = useSelector((state: RootState) => state.cart.isCheckout);
  const [isOpen, setIsOpen] = useState(false);

  const totalPrice = cartItems
    .filter(item => item.selected) // Chỉ lấy các sản phẩm được chọn
    .reduce((acc, item) => acc + (item.selectedOption.price ?? item.selectedOption.price) * item.quantity, 0);

  const checkoutPrice = cartItems
    .filter(item => item.selected) // Chỉ lấy các sản phẩm được chọn
    .reduce((acc, item) => acc + (item.selectedOption.discountedPrice ?? item.selectedOption.price) * item.quantity, 0);

  const totalDiscount = cartItems
    .filter(item => item.selected) // Chỉ lấy các sản phẩm được chọn
    .reduce((acc, item) => {
      if (item.selectedOption.isDiscounted && item.selectedOption.discountedPrice) {
        // Tính số tiền giảm cho từng sản phẩm
        const discountAmount = (item.selectedOption.price - item.selectedOption.discountedPrice) * item.quantity;
        return acc + discountAmount;
      }
      return acc;
    }, 0);
  useEffect(() => {
    setMessage('');
  }, [totalPrice]);

  const handleCheckout = () => {
    if (totalPrice > 0) {
      dispatch(goToCheckout());
    } else {
      setMessage('Vui lòng chọn sản phẩm');
    }
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${isCheckout  && "mt-7"}`}>
      <button onClick={() => setIsOpen(true)} className="flex justify-between items-center font-semibold bg-blue-100 text-blue-700 rounded-lg p-3 w-full">
        Áp dụng ưu đãi để được giảm giá
        <FaAngleRight />
      </button>
      {isOpen && <VoucherModal onClose={() => setIsOpen(false)} />}
      <div className="flex justify-between font-semibold mt-2">
        <span className=" text-gray-500">Tổng tiền</span>
        <span className=" text-gray-900">{totalPrice.toLocaleString()}đ</span>
      </div>
      <div className="flex justify-between font-semibold mt-2">
        <span className="text-gray-500">Giảm giá trực tiếp</span>
        <span className=" text-orange-400">{totalDiscount.toLocaleString()}đ</span>
      </div>
      <div className="flex justify-between font-semibold mt-2">
        <div className="flex items-center gap-1">
          <span className="text-gray-500">Giảm giá voucher </span>
          <div className="rounded-full bg-gray-400 w-3.5 h-3.5 flex items-center justify-center">
            <FaQuestion size={10} color="white" />
          </div>
        </div>
        <span className=" text-orange-400">0đ</span>
      </div>
      {isCheckout && (
        <div className="flex justify-between font-semibold mt-2">
          <span className="text-gray-500">Phí vận chuyển</span>
          <span className=" text-black">Miễn phí</span>
        </div>
      )}
      <div className="flex justify-between font-semibold mt-2 text-lg border-t border-gray-300 pt-2">
        <span className=" text-gray-900">Thành tiền</span>
        <span className=" text-blue-700">{checkoutPrice.toLocaleString()}đ</span>
      </div>

      <span className="text-orange-500 font-semibold">{message}</span>
      <button
        onClick={handleCheckout}
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700"
      >
        {isCheckout ? "Hoàn tất" : "Mua hàng"}
      </button>

    </div>
  );
};

export default CartSummary;
