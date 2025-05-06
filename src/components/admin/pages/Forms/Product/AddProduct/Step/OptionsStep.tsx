import { ProductOptionInt } from "../ProductCreationForm";
import { Plus } from "lucide-react";
import { ProductOption } from "./ProductOption";


interface OptionsStepProps {
    options: ProductOptionInt[];
    onAddOption: () => void;
    onUpdateOptionField: (
        id: string,
        field: keyof Omit<ProductOptionInt, "id">,
        value: string | number
    ) => void;
    onRemoveOption: (id: string) => void;
}


export const OptionsStep: React.FC<OptionsStepProps> = ({
    options,
    onAddOption,
    onUpdateOptionField,
    onRemoveOption,
}) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Tùy chọn sản phẩm</h2>
                <button
                    type="button"
                    onClick={onAddOption}
                    className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
                >
                    <Plus size={16} className="mr-1" /> Thêm tùy chọn
                </button>
            </div>

            {options.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>Chưa có tùy chọn nào. Nhấn "Thêm tùy chọn" để bắt đầu.</p>
                    <p className="text-sm mt-2">
                        (Ví dụ: Màu sắc, Kích thước, Chất liệu,...)
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {options.map((option) => (
                        <ProductOption
                            key={option.id}
                            option={option}
                            onUpdateField={onUpdateOptionField}
                            onRemove={onRemoveOption}
                        />

                    ))}
                </div>
            )}
        </div>
    );
};