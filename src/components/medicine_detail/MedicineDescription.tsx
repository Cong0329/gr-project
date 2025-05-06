import { useState } from "react";
import { ProductDetail, ProductOption, policies } from "./medicine";
import { Sheet } from "react-modal-sheet";
import { FaXmark } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAPI } from "../../redux/cartAsyncThunk";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
interface ProductProps {
    medicineData: ProductDetail;
    setIsOpen: (value: boolean) => void;
    isOpen: boolean;
}
export const MedicineDescription = ({ medicineData, isOpen, setIsOpen }: ProductProps) => {
    const dispatch = useDispatch();
    const [selectedOption, setSelectedOption] = useState(medicineData.options[0]);
    const {review} = useSelector((state: RootState) => state.products);
    const { user } = useSelector((state: RootState) => state.auth);
    const [quantity, setQuantity] = useState(1);
    const increaseQuantity = () => setQuantity((prev) => prev + 1);
    const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));
    const rating = review.length > 0 ? (review.reduce((sum, r) => sum + (parseFloat(r.rating ?? "0") ?? 0), 0) / review.length).toFixed(1) : "0.0";
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setQuantity(isNaN(value) || value < 1 ? 1 : value);
    };
    const addToCart = () => {
        if (medicineData.quantity > quantity && Object.keys(user).length > 0) {
            dispatch(addToCartAPI({ product_id: medicineData.id, quantity: quantity, option_id: selectedOption.id }));
            toast.success("Thêm vào giỏ hàng thành công");
        } else if (Object.keys(user).length === 0) {
            toast.warning("Vui lòng đăng nhập để thêm vào giỏ hàng");
        } else {
            toast.warning("Số lượng sản phẩm không đủ");
        }
    };
    return (
        <div className="w-3/5 ml-10 tb:ml-0 space-y-2 tb:w-full">
            <h2 className="text-xl font-semibold">{medicineData.name}</h2>
            <p className="text-black font-semibold">Thương hiệu: <a href="#" className="text-blue-700">{medicineData.brand.name}</a></p>
            <div className="flex items-center gap-2 ms:text-sm mm:text-[12px]">
                <span className="text-gray-500 cursor-pointer">{medicineData.code}</span>
                <span className="bg-gray-300 w-1.5 h-1.5 rounded-full"></span>
                <span className="text-gray-500 cursor-pointer">{rating} ⭐</span>
                <span className="bg-gray-300 w-1.5 h-1.5 rounded-full"></span>
                <a href="#reviews" className="text-blue-700 capitalize">{review.length} đánh giá</a>
            </div>
            <div>
                {/* Hiển thị giá */}
                <div className="flex flex-col">
                    <div>
                        <span className="text-2xl font-semibold text-blue-700">
                            {selectedOption.discounted_price && selectedOption.discounted_price > 0
                                ? parseFloat(selectedOption.discounted_price).toLocaleString()
                                : parseFloat(selectedOption.price).toLocaleString()}đ
                        </span>
                        <span className="text-blue-700 text-lg font-medium">/ {selectedOption.label}</span>

                    </div>


                    {selectedOption.discounted_price && selectedOption.discounted_price > 0 && (
                        <span className="text-lg text-gray-500 line-through">
                            {parseFloat(selectedOption.price).toLocaleString()}đ
                        </span>
                    )}

                </div>

                <div className="grid grid-cols-[200px_1fr] ms:grid-cols-[100px_1fr] gap-y-2 items-center text-gray-700">
                    <div className="font-semibold ">Chọn đơn vị tính</div>
                    <div className="flex gap-2">
                        {medicineData.options.map((option: ProductOption) => (
                            <button
                                key={option.id}
                                onClick={() => setSelectedOption(option)}
                                className={`px-4 py-2 border rounded-full transition-colors duration-200 ${selectedOption.id === option.id ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    <div className="font-semibold">Danh mục</div>
                    <div className="text-blue-500">{medicineData.category.name}</div>

                    <div className="font-semibold">Dạng bào chế</div>
                    <div>{medicineData.dosage_form}</div>

                    <div className="font-semibold">Quy cách</div>
                    <div>{medicineData.specification}</div>

                    <div className="font-semibold">Xuất xứ thương hiệu</div>
                    <div>{medicineData.brand.original}</div>

                    <div className="font-semibold">Nhà sản xuất</div>
                    <div>{medicineData.manufacturer}</div>

                    <div className="font-semibold">Nước sản xuất</div>
                    <div>{medicineData.brand.country}</div>

                    <div className="font-semibold">Thành phần</div>
                    <div>{medicineData.ingredients}</div>

                    <div className="font-semibold">Mô tả ngắn</div>
                    <div>{medicineData.description}</div>

                    <div className="font-semibold">Số đăng ký</div>
                    <div>{medicineData.registration_number}</div>

                    <div className="font-semibold tb:hidden">Chọn số lượng</div>
                    <div className="flex items-center  overflow-hidden tb:hidden">
                        <button
                            onClick={decreaseQuantity}
                            className="px-3 py-1 border rounded-l-full text-gray-600 hover:bg-gray-100 "
                        >
                            –
                        </button>

                        <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="w-10 py-1 border text-center outline-none bg-transparent no-spinner"
                        />



                        <button
                            onClick={increaseQuantity}
                            className="px-3 py-1 border rounded-r-full text-gray-600 hover:bg-gray-100"
                        >
                            +
                        </button>
                    </div>

                </div>
                <div className="flex mt-5 text-gray-700">


                </div>


            </div>

            <button className="mt-4 w-full bg-blue-500 text-white px-6 py-2 rounded-md tb:hidden" onClick={addToCart}>Chọn mua</button>

            <div className="border-t-2 border-gray-200 flex mt-5 pt-5 ">
                <div className="flex space-x-8 ml:flex-col ml:space-x-0 ml:space-y-2">
                    {policies.map((policy, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <span className="text-3xl text-blue-500">{policy.icon}</span>
                            <div>
                                <p className="font-semibold">{policy.title}</p>
                                <p className="text-gray-500 text-sm">{policy.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Bottom Sheet */}
            <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <Sheet.Container>

                    <div className="flex items-center justify-between font-medium text-xl border-b p-4">
                        {/* Đoạn text ở giữa */}
                        <p className="text-center flex-grow">Chọn số lượng đơn vị</p>

                        {/* Nút đóng nằm bên phải */}
                        <button className="flex-none" onClick={() => setIsOpen(false)}>
                            <FaXmark size={30} />
                        </button>
                    </div>

                    <Sheet.Content>
                        <div className="p-4 space-y-2">
                            <div className="flex">
                                <div className="w-36  border-2 rounded-lg p-2 mr-2">
                                    <img src={medicineData.images[0].image} alt="" className="w-full h-full object-contain" />
                                </div>
                                <div className="">
                                    <p className="font-medium text-gray-600">{medicineData.name}</p>
                                    <div className="flex flex-col">
                                        <div>
                                            <span className="text-2xl font-semibold text-blue-700">
                                                {selectedOption.discounted_price && selectedOption.discounted_price > 0
                                                    ? selectedOption.discounted_price.toLocaleString()
                                                    : selectedOption.price.toLocaleString()}đ
                                            </span>


                                        </div>


                                        {selectedOption.discounted_price && selectedOption.discounted_price > 0 && (
                                            <span className="text-lg text-gray-500 line-through">
                                                {selectedOption.price.toLocaleString()}đ
                                            </span>
                                        )}

                                    </div>
                                </div>
                            </div>
                            <div className="font-semibold ">Chọn đơn vị</div>
                            <div className="flex gap-2">
                                {medicineData.options.map((option: ProductOption) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setSelectedOption(option)}
                                        className={`px-4 py-2 border rounded-full transition-colors duration-200 ${selectedOption.id === option.id ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>


                            {/* Chọn số lượng */}
                            <div className="font-semibold">Chọn số lượng</div>
                            <div className="flex items-center  overflow-hidden ">
                                <button
                                    onClick={decreaseQuantity}
                                    className="px-3 py-1 border rounded-l-full text-gray-600 hover:bg-gray-100 "
                                >
                                    –
                                </button>

                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="w-10 py-1 border text-center outline-none bg-transparent no-spinner"
                                />



                                <button
                                    onClick={increaseQuantity}
                                    className="px-3 py-1 border rounded-r-full text-gray-600 hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>

                            {/* Tính tiền  */}
                            <div className="flex">
                                <div className="font-semibold grow">
                                    Tạm tính
                                </div>
                                <span className="text-xl font-semibold text-gray-600 flex-none">
                                    {selectedOption.discounted_price && selectedOption.discounted_price > 0
                                        ? ((selectedOption.discounted_price) * quantity).toLocaleString()
                                        : ((selectedOption.price) * quantity).toLocaleString()}đ
                                </span>




                            </div>
                            <div className="flex">
                                <div className="font-semibold grow">
                                    Tiết kiệm được
                                </div>
                                <span className="text-xl font-semibold text-gray-600 flex-none">
                                    {((selectedOption.price - (selectedOption.discounted_price || selectedOption.price)) * quantity).toLocaleString()}đ
                                </span>




                            </div>


                            {/* Nút mua */}
                            <div className='flex gap-2 font-medium'>
                                <button
                                    className="mt-6 bg-blue-100 text-blue-600 px-4 py-3 rounded-full w-full"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Thêm vào giỏ hàng
                                </button>  <button
                                    className="mt-6 bg-blue-600 text-white px-4 py-3 rounded-full w-full"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Mua ngay
                                </button>
                            </div>

                        </div>
                    </Sheet.Content>
                </Sheet.Container>

                {/* Vuốt xuống để đóng */}
                <Sheet.Backdrop onTap={() => setIsOpen(false)} />
            </Sheet>
        </div>
    )
}