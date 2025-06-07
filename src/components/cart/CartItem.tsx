import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { removeFromCartAPI, updateQuantityAPI, updateSelectedOptionAPI } from "../../redux/cartAsyncThunk";
import { toggleSelectItem, ProductOption } from "../../redux/cartSlice";
import { FaTrash } from "react-icons/fa6";
import PackageSelector from "./PackageSelector";
import { ModalDelete } from "./ModalDelete";
import axios from "axios";
import { Link } from "react-router-dom";
import { resetProduct } from "../../redux/productSlice";
import { AppDispatch } from "../../redux/store";
import { removeCartItemId } from "../../redux/orderSlice";

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  quantity: number;
  image: string;
  selected: boolean;
  selectedOption: string | ProductOption;
  slug: string;
}

interface CartItemProps {
  item: CartItem;
  isFirst: number;
}

const CartItem: React.FC<CartItemProps> = ({ isFirst, item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const [newQuantity, setNewQuantity] = useState(item.quantity);
  const { id, product_id, name, quantity, image, selected, selectedOption, slug } = item;
  const [options, setOptions] = useState<ProductOption[]>([]);
  useEffect(() => {
    setNewQuantity(quantity);
  }, [quantity]);
  useEffect(() => {
    const fetchOptions = async () => {
      const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/product-option/${product_id}`);
      setOptions(response.data);
    };
    fetchOptions();
  }, [product_id])

  // Tính tổng tiền dựa trên tùy chọn được chọn
  const totalPrice = Number((selectedOption as ProductOption)?.discounted_price) > 0 ?  Number((selectedOption as ProductOption)?.discounted_price) * quantity : Number((selectedOption as ProductOption)?.price) * quantity;

  const handleRemove = () => {
    dispatch(removeFromCartAPI(id))
    setIsOpen(false);
  };

  // Cập nhật tùy chọn gói sản phẩm
  const handleOptionChange = (newOption: string) => {
    const selected = options.find(option => option.label === newOption);
    if (selected?.id !== (selectedOption as ProductOption)?.id) {
      dispatch(updateSelectedOptionAPI({ cartItemId: id, option_id: selected?.id }));
    }
  };

  // Cập nhật số lượng
  const handleQuantityDecrement = () => {
    if (newQuantity > 1) {
      const updated = newQuantity - 1;
      setNewQuantity(updated);
      dispatch(updateQuantityAPI({ cartItemId: id, quantity: updated }));
    }
  };

  const handleQuantityIncrement = () => {
    const updated = newQuantity + 1;
    setNewQuantity(updated);
    dispatch(updateQuantityAPI({ cartItemId: id, quantity: updated }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (isNaN(value) || value < 1) value = 1;
    setNewQuantity(value);
    dispatch(updateQuantityAPI({ cartItemId: id, quantity: value }));
  };


  return (
    <div

      className={`flex items-center py-4 text-black gap-x-2 ${isFirst === 0 ? "border-none" : "border-t border-gray-300"}`}
    >
      {/* Checkbox chọn sản phẩm */}
      <input
        type="checkbox"
        className="w-4 h-4"
        checked={selected}
        onChange={() => { dispatch(toggleSelectItem(id)); dispatch(removeCartItemId(Number(id))) }}
      />

      <div className="ml:hidden flex items-center gap-x-2">

        {/* Ảnh và tên sản phẩm */}
        <div className="flex items-center gap-x-2 flex-1">
          <Link to={`/medicine-detail/${slug}`} onClick={() => dispatch(resetProduct())}>
          <img src={image} alt={name} className="w-16 h-16 rounded-xl border p-1" loading="lazy" />
          </Link>
          <p
            className="text-sm text-left w-60 md-lg:w-52 overflow-hidden h-10 max-h-10"
            title={name}
          >
            {name}
          </p>
        </div>

        {/* Giá tiền */}
        <div>
          <p className="text-blue-700 w-24 font-semibold text-sm">{Number((selectedOption as ProductOption)?.discounted_price) > 0 ? Number((selectedOption as ProductOption)?.discounted_price).toLocaleString() : Number((selectedOption as ProductOption)?.price).toLocaleString()}đ</p>
          {Number((selectedOption as ProductOption)?.discounted_price) > 0 && (
            <p className="text-gray-700 w-24 font-semibold text-[12px] line-through">{Number((selectedOption as ProductOption)?.price).toLocaleString()}đ</p>
          )}

        </div>

        {/* Điều chỉnh số lượng */}
        <div className="w-32">
          <div className="flex w-28 border rounded-full items-center">
            <button
              className="px-3 py-1 border-r disabled:opacity-50"
              onClick={handleQuantityDecrement}
              disabled={newQuantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              className="w-10 text-center outline-none no-spinner"
              value={newQuantity}
              onChange={handleQuantityChange}
            />
            <button
              className="px-3 py-1 border-l"
              onClick={handleQuantityIncrement}
            >
              +
            </button>
          </div>
        </div>

        {/* Chọn tùy chọn sản phẩm */}
        <div className="w-28">
          <PackageSelector
            selectedOption={(selectedOption as ProductOption)?.label}
            options={options.map(option => option.label)}
            onChange={handleOptionChange}
          />
        </div>

        {/* Nút xóa sản phẩm */}
        <button onClick={() => setIsOpen(true)} className="text-gray-500 w-8 px-2">
          <FaTrash />
        </button>


      </div>

      <div className="hidden ml:flex ml:items-center">
        <div>
          <div className="flex items-start gap-x-2 flex-1">
            <img src={image} alt={name} className="w-16 h-16 rounded-xl border p-1" loading="lazy" />
            <div>
              <p
                className="text-sm text-left w-60 md-lg:w-52 overflow-hidden h-5 max-h-5 ms:w-44"
                title={name}
              >
                {name}
              </p>
              {/* Giá tiền */}
              <p className="text-blue-700 w-24 font-semibold text-sm">{totalPrice.toLocaleString()}đ</p>
            </div>
          </div>
          <div className="flex justify-end ms:pt-1 ">
            {/* Điều chỉnh số lượng */}
            <div className="w-32">
              <div className="flex w-28 border rounded-full items-center">
                <button
                  className="px-3 py-1 border-r disabled:opacity-50"
                  onClick={handleQuantityDecrement}
                  disabled={newQuantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  className="w-10 text-center outline-none no-spinner"
                  value={newQuantity}
                  onChange={handleQuantityChange}
                />
                <button
                  className="px-3 py-1 border-l"
                  onClick={handleQuantityIncrement}
                >
                  +
                </button>
              </div>
            </div>

            {/* Chọn tùy chọn sản phẩm */}
            <div className="">
              <PackageSelector
                selectedOption={(selectedOption as ProductOption)?.label}
                options={options.map(option => option.label)}
                onChange={handleOptionChange}
              />
            </div>
          </div>


        </div>
        {/* Nút xóa sản phẩm */}
        <button onClick={() => setIsOpen(true)} className="text-gray-500 w-8 px-2">
          <FaTrash />
        </button>
      </div>
      {isOpen && (
        <ModalDelete
          message="Bạn có chắc chắn muốn xóa sản phẩm này?"
          onClose={() => setIsOpen(false)}
          onDelete={handleRemove}
        />
      )}
    </div>
  );
};

export default CartItem;
