import { useState } from "react";
import { Product } from "./MedicineSlider/MedicineSlider";
import { ProductOption } from "./MedicineSlider/MedicineSlider";
export const MedicineDescription = ({ medicineData }: Product) => {
    const [selectedOption, setSelectedOption] = useState(medicineData.options[0]);
    const [quantity, setQuantity] = useState(1);
    const increaseQuantity = () => setQuantity((prev) => prev + 1);
    const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setQuantity(isNaN(value) || value < 1 ? 1 : value);
    };
    return (
        <div className="w-3/5 ml-10 space-y-2">
            <h2 className="text-xl font-semibold">{medicineData.name}</h2>
            <p className="text-black font-semibold">Thương hiệu: <a href="#" className="text-blue-700">{medicineData.brand}</a></p>
            <div className="flex items-center gap-2">
                <span className="text-gray-500 cursor-pointer">{medicineData.code}</span>
                <span className="bg-gray-300 w-1.5 h-1.5 rounded-full"></span>
                <span className="text-gray-500 cursor-pointer">{medicineData.rating} ⭐</span>
                <span className="bg-gray-300 w-1.5 h-1.5 rounded-full"></span>
                <a href="#" className="text-blue-700 capitalize">{medicineData.review} đánh giá</a>
                <span className="bg-gray-300 w-1.5 h-1.5 rounded-full"></span>
                <a href="#" className="text-blue-700 capitalize">{medicineData.comments} bình luận</a>
            </div>
            <div>
                {/* Hiển thị giá */}
                <div className="flex flex-col">
                    <div>
                        <span className="text-2xl font-semibold text-blue-700">
                            {selectedOption.isDiscounted && selectedOption.discountedPrice
                                ? selectedOption.discountedPrice.toLocaleString()
                                : selectedOption.price.toLocaleString()}đ
                        </span>
                        <span className="text-blue-700 text-lg font-medium">/ {selectedOption.label}</span>

                    </div>


                    {selectedOption.isDiscounted && selectedOption.discountedPrice && (
                        <span className="text-lg text-gray-500 line-through">
                            {selectedOption.price.toLocaleString()}đ
                        </span>
                    )}

                </div>

                <div className="grid grid-cols-[200px_1fr] gap-y-2 items-center text-gray-700">
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
                    <div className="text-blue-500">{medicineData.category}</div>

                    <div className="font-semibold">Dạng bào chế</div>
                    <div>{medicineData.dosageform}</div>

                    <div className="font-semibold">Quy cách</div>
                    <div>{medicineData.specification}</div>

                    <div className="font-semibold">Xuất xứ thương hiệu</div>
                    <div>{medicineData.origin}</div>

                    <div className="font-semibold">Nhà sản xuất</div>
                    <div>{medicineData.manufacturer}</div>

                    <div className="font-semibold">Nước sản xuất</div>
                    <div>{medicineData.country}</div>

                    <div className="font-semibold">Thành phần</div>
                    <div>{medicineData.ingredients}</div>

                    <div className="font-semibold">Mô tả ngắn</div>
                    <div>{medicineData.description}</div>

                    <div className="font-semibold">Số đăng ký</div>
                    <div>{medicineData.registrationNumber}</div>

                    <div className="font-semibold">Chọn số lượng</div>
                    <div className="flex items-center  overflow-hidden">
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

            <button className="mt-4 w-full bg-blue-500 text-white px-6 py-2 rounded-md">Chọn mua</button>
        </div>
    )
}