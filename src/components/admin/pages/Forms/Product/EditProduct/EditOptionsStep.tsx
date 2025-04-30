import { useState } from "react";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/store";
import { EditProductOption } from "./EditOption";
import { ModalAddProductOption } from "./ModalAddProductOption";

export const EditOptionsStep = () => {
    const { product } = useSelector((state: RootState) => state.products);
    const [showModal, setShowModal] = useState(false);
    const [options, setOptions] = useState(product.options || []);

    const handleAddOption = (newOption: any) => {
        setOptions((prev) => [...prev, { ...newOption, id: Date.now() }]); // Tạo ID tạm thời
    };

    return (
        <div className="">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Tùy chọn sản phẩm</h2>
                <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
                >
                    <Plus size={16} className="mr-1" /> Thêm tùy chọn
                </button>
            </div>

            {options.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>Chưa có tùy chọn nào. Nhấn "Thêm tùy chọn" để bắt đầu.</p>
                    <p className="text-sm mt-2">(Ví dụ: Màu sắc, Kích thước, Chất liệu,...)</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {options.map((option) => (
                        <EditProductOption key={option.id} option={option} />
                    ))}
                </div>
            )}

            {showModal && (
                <ModalAddProductOption
                    onClose={() => setShowModal(false)}
                    onSave={handleAddOption}
                    id={product.id}
                />
            )}
        </div>
    );
};
