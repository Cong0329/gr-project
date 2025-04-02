import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { CheckoutItem } from "./CheckoutItem";
import AddressSelection from "./AddressSelection";


const Checkout: React.FC = () => {

  const cartItems = useSelector((state: RootState) => state.cart.items);

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
          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" defaultChecked />
            <img src="https://i.imgur.com/9GxNvdb.png" alt="" />
            <span>Thanh toán khi nhận hàng</span>
          </label>

          <label className="flex items-center space-x-2 mt-2">
            <input type="radio" name="payment" />
            <img src="https://i.imgur.com/GIYkroG.png" alt="" />
            <span>Chuyển khoản ngân hàng</span>
          </label>
        </div>


      </div>
    </div>
  );
};

export default Checkout;
