import { useDispatch, useSelector } from "react-redux";
import { goToCheckout, checkout } from "../../redux/cartSlice";
import { RootState } from "../../redux/store";
import { FaAngleRight, FaQuestion } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { VoucherModal } from "./VoucherModal";
import { CartSummartSkeleton } from "./CartSummartSkeleton";
import { createOrder } from "../../redux/orderAsyncThunk";

interface CartSummaryProps {
  isDetail?: boolean | null;
  status?: string | null;
  isLoading?: boolean | null;
}

const CartSummary: React.FC<CartSummaryProps> = ({ isDetail, status, isLoading }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isCheckout = useSelector((state: RootState) => state.cart.isCheckout);
  const {orderForm} = useSelector((state: RootState) => state.order);
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    if (isDetail) {
      dispatch(checkout(false))
    }
  }, [isDetail, dispatch])

  const totalPrice = cartItems
    .filter(item => item.selected) // Chỉ lấy các sản phẩm được chọn
    .reduce((acc, item) => acc + (item.selectedOption.price ?? item.selectedOption.price) * item.quantity, 0);

  const checkoutPrice = cartItems
    .filter(item => item.selected) // Chỉ lấy các sản phẩm được chọn
    .reduce((acc, item) => acc + (item.selectedOption.discounted_price > 0 ? item.selectedOption.discounted_price : item.selectedOption.price) * item.quantity, 0);

  const totalDiscount = cartItems
    .filter(item => item.selected) // Chỉ lấy các sản phẩm được chọn
    .reduce((acc, item) => {
      if (item.selectedOption.discounted_price > 0) {
        // Tính số tiền giảm cho từng sản phẩm
        const discountAmount = (item.selectedOption.price - item.selectedOption.discounted_price) * item.quantity;
        return acc + discountAmount;
      }
      return acc;
    }, 0);
  useEffect(() => {
    setMessage('');
  }, [totalPrice]);

  const handleCheckout = () => {
    if (!isCheckout) {
      if (totalPrice > 0) {
        dispatch(goToCheckout());
      } else {
        setMessage('Vui lòng chọn sản phẩm');
      }
      return;
    }
  
    // Nếu đang ở bước checkout
    if (orderForm.shipping_address_id && orderForm.payment_method) {
      dispatch(createOrder(orderForm));
    } else {
      setMessage('Vui lòng chọn địa chỉ giao hàng và phương thức thanh toán');
    }
  };
  


  let buy;
  if (isDetail) {
    buy = "Mua lại";
  } else if (isCheckout) {
    buy = "Hoàn tất";
  } else {
    buy = "Mua hàng";
  }

  let content;

  if (isLoading) {
    content = (
      <CartSummartSkeleton isCheckout={isCheckout} isDetail={isDetail} />
    )
  } else {
    content = (
      <div className={`bg-white p-4 rounded-lg ${isCheckout ? "mt-7" : "mt-0"}`}>
        <button onClick={() => setIsOpen(true)} className="flex md-lg:text-sm justify-between items-center font-semibold bg-blue-100 text-blue-700 rounded-lg p-3 w-full">
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
        {isDetail && (
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

        {isDetail && (
          <div className="font-semibold mt-2 border-t border-gray-300 pt-2 text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-black">Phương thức thanh toán</span>
              {status === 'delivered' && (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 mx-auto rounded-full bg-green-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-green-500">Đã thanh toán</p>
                </div>
              )}

            </div>
            {isDetail && (
              <div className="flex items-center space-x-2">
                <img src="https://i.imgur.com/9GxNvdb.png" alt="" className="h-10 w-10" />
                <span className="text-gray-700">Thanh toán tiền mặt khi nhận hàng</span>
              </div>
            )}


          </div>
        )}


        <button
          onClick={handleCheckout}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700"
        >
          {buy}
        </button>

      </div>
    )
  }

  return (
    <div>{content}</div>
  );
};

export default CartSummary;
