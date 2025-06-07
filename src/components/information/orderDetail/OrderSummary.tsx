import {  useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { FaAngleRight, FaQuestion } from "react-icons/fa6";

import { CartSummartSkeleton } from "../../cart/CartSummartSkeleton";
import { repurchaseOrderAPI } from "../../../redux/cartAsyncThunk";
import { toast } from "react-hot-toast";
import { updateOrderCancelled, updateOrderCompleted } from "../../../redux/orderAsyncThunk";

interface OrderSummaryProps {
  id?: string | null;
  isDetail?: boolean | null;
  status?: string | null;
  isLoading?: boolean | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ id, isDetail, status, isLoading }) => {
  const methodImages: Record<string, string> = {
    "cod": "https://i.imgur.com/9GxNvdb.png",
    "vnpay": "https://i.imgur.com/GIYkroG.png",
  };
  const {orderDetail} = useSelector((state: RootState) => state.order);
  const isCheckout = false;
  const dispatch: AppDispatch = useDispatch();

  const totalPrice = parseFloat(orderDetail.discout_price as string);

  const checkoutPrice = parseFloat(orderDetail.total_price as string);

  const totalDiscount =  parseFloat(orderDetail.discout_price as string) - parseFloat(orderDetail.total_price as string);


  const handleRepurchaseOrder = () => {
    toast.success("Đã thêm sản phẩm vào giỏ hàng");
    dispatch(repurchaseOrderAPI(id?.toString() ?? ''))
  };

  const handleCancelOrder = () => {
    dispatch(updateOrderCancelled(id?.toString() ?? ''))
  }

  const handleCompletedOrder = () => {
    dispatch(updateOrderCompleted(id?.toString() ?? ''))
  }
  
  let content;

  if (isLoading) {
    content = (
      <CartSummartSkeleton isCheckout={isCheckout} isDetail={isDetail} />
    )
  } else {
    content = (
      <div className={`bg-white p-4 rounded-lg ${isCheckout ? "mt-7" : "mt-0"}`}>
        <button disabled={true} className="cursor-not-allowed flex md-lg:text-sm justify-between items-center font-semibold bg-blue-100 text-blue-700 rounded-lg p-3 w-full">
          Áp dụng ưu đãi để được giảm giá
          <FaAngleRight />
        </button>
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
                <img src={methodImages[orderDetail.payment_method.method]} alt="" className="h-10 w-10" />
                <span className="text-gray-700">{orderDetail.payment_method.description}</span>
              </div>
            )}


          </div>
        )}

        {(status === 'cancelled' || status === 'return'|| status === 'completed') ? (
          <button
            onClick={handleRepurchaseOrder}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700"
          >
            Mua lại
          </button>
        ) : (status === 'pending' || status === 'confirmed') ? (
          <button
            onClick={handleCancelOrder}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700"
          >
            Hủy đặt hàng
          </button>
        ) : (
          <button
            onClick={handleCompletedOrder}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700"
          >
            Đã nhận hàng
          </button>
        )}
      </div>
    )
  }

  return (
    <div>{content}</div>
  );
};

export default OrderSummary;
