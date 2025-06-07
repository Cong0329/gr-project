import { useState } from "react";
import { useDispatch } from "react-redux";
import { createProductOption } from "../../../../../../redux/productAsyncThunk";
import { AppDispatch } from "../../../../../../redux/store";

interface ModalAddProductOptionProps {
    onClose: () => void;
    id: string;
    onSave: (option: { label: string; price: number; discounted_price: number }) => void;
}

export const ModalAddProductOption: React.FC<ModalAddProductOptionProps> = ({ onClose, onSave, id }) => {
    const dispatch:AppDispatch = useDispatch();
    const [label, setLabel] = useState("");
    const [price, setPrice] = useState<number | string>(0);
    const [discountedPrice, setDiscountedPrice] = useState<number | string>(0);

    const isValid = () => {
        const p = Number(price);
        const dp = Number(discountedPrice);
        return label && p > dp;
    };

    const handleSave = () => {
        if (isValid()) {
            onSave({
                label,
                price: Number(price),
                discounted_price: Number(discountedPrice),
            });
            onClose();
            dispatch(createProductOption({
                product_id: id,
                fullOption: [{
                    id: "",
                    label,
                    price: Number(price),
                    discounted_price: Number(discountedPrice),
                }],
            }   
            ));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[100000] flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg space-y-4">
                <h3 className="text-lg font-semibold">Thêm tùy chọn mới</h3>

                <div>
                    <label className="block text-sm mb-1">Tên nhãn</label>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Giá gốc</label>
                    <input
                        type="text"
                        value={price === 0 ? "" : Number(price).toLocaleString("vi-VN")}
                        onChange={(e) => {
                            const raw = e.target.value.replace(/\./g, "").replace(/\D/g, "");
                            setPrice(raw ? Number(raw) : 0);
                        }}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Giá khuyến mãi</label>
                    <input
                        type="text"
                        value={discountedPrice === 0 ? "" : Number(discountedPrice).toLocaleString("vi-VN")}
                        onChange={(e) => {
                            const raw = e.target.value.replace(/\./g, "").replace(/\D/g, "");
                            setDiscountedPrice(raw ? Number(raw) : 0);
                        }}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>


                {price !== 0 && discountedPrice !== 0 && Number(price) <= Number(discountedPrice) && (
                    <p className="text-red-500 text-sm">Giá gốc phải lớn hơn giá khuyến mãi</p>
                )}

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Hủy</button>
                    <button
                        onClick={handleSave}
                        disabled={!isValid()}
                        className={`px-4 py-2 rounded ${isValid() ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};
