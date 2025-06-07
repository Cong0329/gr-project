
import { ProductOptionInt } from "../ProductCreationForm";
import { X } from "lucide-react";

interface ProductOptionProps {
    option: ProductOptionInt;
    onUpdateField: (
        id: string,
        field: keyof Omit<ProductOptionInt, "id">,
        value: string | number
    ) => void;
    onRemove: (id: string) => void;
}

export const ProductOption: React.FC<ProductOptionProps> = ({
    option,
    onUpdateField,
    onRemove,
}) => {
    return (
        <div className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
                <div>
                    <label htmlFor="label">Tên nhãn (vd: Gói, hộp, vỉ, viên,....)</label>
                    <input
                        id="label"
                        type="text"
                        value={option.label}
                        onChange={(e) => onUpdateField(option.id, "label", e.target.value)}
                        className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />

                </div>

                <button
                    type="button"
                    onClick={() => onRemove(option.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                >
                    <X size={18} />
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <label htmlFor="price">Giá gốc</label>
                <input
                    id="price"
                    type="text"
                    value={option.price.toLocaleString('vi-VN')}
                    onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, ''); // Bỏ hết ký tự không phải số
                        onUpdateField(option.id, "price", Number(rawValue));
                    }}
                    className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="discounted_price">Giá khuyến mãi</label>
                <input
                    id="discounted_price"
                    type="text"
                    value={option.discounted_price?.toLocaleString('vi-VN')}
                    onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, ''); // Bỏ hết ký tự không phải số
                        onUpdateField(option.id, "discounted_price", Number(rawValue));
                    }}
                    className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

            </div>
        </div>
    );
};