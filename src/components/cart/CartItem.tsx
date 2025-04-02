import { useDispatch } from "react-redux";
import { removeFromCartAPI, updateQuantityAPI, updateSelectedOptionAPI } from "../../redux/cartAsyncThunk";
import { toggleSelectItem, updateQuantity, updateSelectedOption } from "../../redux/cartSlice";
import { FaTrash } from "react-icons/fa6";
import PackageSelector from "./PackageSelector";
import { ProductOption } from "./product";


interface CartItem {
  id: string;
  name: string;
  quantity: number;
  image: string;
  selected: boolean;
  selectedOption: ProductOption;
  options: ProductOption[];
}

interface CartItemProps {
  item: CartItem;
  isFirst: number;
}

const CartItem: React.FC<CartItemProps> = ({ isFirst, item }) => {
  const dispatch = useDispatch();
  const { id, name, quantity, image, selected, selectedOption, options } = item;

  // Tính tổng tiền dựa trên tùy chọn được chọn
  const totalPrice = (selectedOption.discountedPrice ?? selectedOption.price) * quantity;

  const handleRemove = () => dispatch(removeFromCartAPI(id));

  // Cập nhật tùy chọn gói sản phẩm
  const handleOptionChange = (newOption: string) => {
    const selected = options.find(option => option.label === newOption);
    if (selected) {
      dispatch(updateSelectedOptionAPI({ id, selectedOption: selected.id }));
    }

  };

  // Cập nhật số lượng
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newQuantity = Number(e.target.value);
    if (isNaN(newQuantity) || newQuantity < 1) newQuantity = 1;
    dispatch(updateQuantityAPI({ id, quantity: newQuantity }));
  };
  const handleQuantityDecrement = () => {
    if (quantity > 1) {  // ✅ Kiểm tra tránh số âm
      const newQuantity = quantity - 1;
      dispatch(updateQuantityAPI({ id, quantity: newQuantity })); // Gọi API
    }
  };

  const handleQuantityIncrement = () => {
    const newQuantity = quantity + 1;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
    dispatch(updateQuantityAPI({ id, quantity: newQuantity }));
  };


  return (
    <div

      className={`flex items-center py-4 text-black gap-x-4 ${isFirst === 0 ? "border-none" : "border-t border-gray-300"}`}
    >
      {/* Checkbox chọn sản phẩm */}
      <input
        type="checkbox"
        className="w-4 h-4"
        checked={selected}
        onChange={() => dispatch(toggleSelectItem(id))}
      />

      {/* Ảnh và tên sản phẩm */}
      <div className="flex items-center gap-x-2 flex-1">
        <img src={image} alt={name} className="w-16 h-16 rounded-xl border p-1" />
        <p className="text-sm text-left w-60">{name}</p>
      </div>

      {/* Giá tiền */}
      <p className="text-blue-700 w-24 font-semibold text-sm">{totalPrice.toLocaleString()}đ</p>

      {/* Điều chỉnh số lượng */}
      <div className="w-32">
        <div className="flex w-28 border rounded-full items-center">
          <button
            className="px-3 py-1 border-r disabled:opacity-50"
            onClick={handleQuantityDecrement}
            disabled={quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            className="w-10 text-center outline-none no-spinner"
            value={quantity}
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
          selectedOption={selectedOption.label}
          options={options.map(option => option.label)}
          onChange={handleOptionChange}
        />
      </div>

      {/* Nút xóa sản phẩm */}
      <button onClick={handleRemove} className="text-gray-500 w-8 px-2">
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;
