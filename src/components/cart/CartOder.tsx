import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { toggleSelectAll } from "../../redux/cartSlice";
import { AnimatePresence, motion } from "framer-motion";
import CartItem from "./CartItem";
const CartOder: React.FC = () => {
  const dispatch:AppDispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  return (
    <div className="mx-auto w-full ">
      <div className="flex gap-x-2 items-center bg-white tb:hidden  rounded-t-xl px-4 py-1 mb-0.5 text-black text-sm font-semibold">
        <div className="flex  w-[330px] items-center md-lg:w-[300px]">
          <input
            type="checkbox"
            className=" w-4 h-4 cursor-pointer"
            checked={cartItems.every((item) => item.selected)}
            onChange={(e) => dispatch(toggleSelectAll(e.target.checked))}
          />
          <span className="ml-2">Chọn tất cả ({cartItems.length})</span>
        </div>
        <div className="w-24">
          <span>Giá thành</span>
        </div>
        <div className="w-36">
          <span>Số lượng</span>
        </div>
        <div className="w-32">
          <span>Đơn vị</span>
        </div>
      </div>

      <div className=" px-4  bg-white rounded-b-xl">
        <AnimatePresence mode="popLayout">
          {cartItems.map((item, index) => (
            <motion.div
            key={item.id} // ✅ Quan trọng: Đảm bảo key là duy nhất
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <CartItem key={item.id} isFirst={index} item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CartOder;
