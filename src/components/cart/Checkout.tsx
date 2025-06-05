import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { CheckoutItem } from "./CheckoutItem";
import AddressSelection from "./AddressSelection";
import { useState, useEffect } from "react";
import axios from "axios";
import { addPaymentMethod } from "../../redux/orderSlice";


const Checkout: React.FC = () => {

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [method, setMethod] = useState([]);
  const dispatch = useDispatch();
  const methodImages: Record<string, string> = {
    "cod": "https://i.imgur.com/9GxNvdb.png",
    "vnpay": "https://i.imgur.com/GIYkroG.png",
  };
  
  useEffect(() => {
    const fetchMethod = async () => {
      const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/payment`);
      const data = await response.data;
      setMethod(data);
    };
    fetchMethod();
  }, []);
  useEffect(() => {
    if(method.length > 0){
      dispatch(addPaymentMethod(method[0].method));
    }
    
  }, [dispatch, method]);
  return (
    <div className="container mx-auto  w-full">
      <div className="">
        <p className="font-semibold text-sm mb-2">Danh sách sản phẩm</p>
        <div className=" px-4  bg-white rounded-xl">
          {cartItems.
            filter((item) => item.selected).
            map((item, index) => (
              <CheckoutItem key={item.id} isFirst={index === 1} item={item} />
            ))}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-semibold mb-2">Chọn địa điểm giao hàng</p>

        <AddressSelection />

      </div>
      <div className="mt-4 ">
        <p className="text-sm font-semibold">Chọn phương thức thanh toán</p>

        <div className="mt-2 bg-white rounded-xl shadow-md p-4">
        {method
            .filter((item) => item.method !== "cash")
            .map((item, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  value={item.method}
                  onChange={(e) => {
                    dispatch(addPaymentMethod(e.target.value));
                  }}
                  defaultChecked={index === 0}
                />
                 <img src={methodImages[item.method]} alt={item.method} className="w-10 h-10" />
                <span>{item.description}</span>
              </label>
            ))}
         
        </div>


      </div>
    </div>
  );
};

export default Checkout;
