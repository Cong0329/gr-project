import { ProductOptionInt } from "../AddProduct/ProductCreationForm";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteProductOption, updateProductOption } from "../../../../../../redux/productAsyncThunk";

interface ProductOptionProps {
    option: ProductOptionInt;
}

export const EditProductOption: React.FC<ProductOptionProps> = ({ option }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [editedOption, setEditedOption] = useState<ProductOptionInt>(option);
    const [originalOption, setOriginalOption] = useState<ProductOptionInt>(option);
    const [isChanged, setIsChanged] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const hasChanged = JSON.stringify(editedOption) !== JSON.stringify(originalOption);
        setIsChanged(hasChanged);
    }, [editedOption, originalOption]);

    const handleChange = (field: keyof ProductOptionInt, value: any) => {
        setEditedOption((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = () => {
        if (editedOption.price > editedOption.discounted_price) {
            setOriginalOption(editedOption); // Cập nhật lại bản gốc
            setIsEditing(false);
            dispatch(updateProductOption({ id: option.id, updateFields: editedOption }));
            console.log(editedOption);
        }

    };

    const handleCancelEdit = () => {
        setEditedOption(originalOption); // Quay lại bản gốc
        setIsEditing(false);
    };

    const handleDelete = () => {
        setIsDeleted(true);
        dispatch(deleteProductOption(option.id));
    };

    if (isDeleted) {
        return null;
    }

    return (
        <div className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
                <div className="flex-1">
                    {isEditing ? (
                        <>
                            <label htmlFor={`label-${option.id}`} className="block text-sm mb-1">Tên nhãn</label>
                            <input
                                id={`label-${option.id}`}
                                type="text"
                                value={editedOption.label}
                                onChange={(e) => handleChange("label", e.target.value)}
                                className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                        </>
                    ) : (
                        <div className="text-lg font-medium">{editedOption.label}</div>
                    )}
                </div>
                <div className="flex space-x-2 ml-2">
                    {isEditing ? (
                        <>
                            {isChanged && editedOption.price > editedOption.discounted_price && (
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white"
                                >
                                    Lưu
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                            >
                                Hủy
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                            Sửa
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-700"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label htmlFor={`price-${option.id}`} className="block text-sm mb-1">Giá gốc</label>
                        <input
                            id={`price-${option.id}`}
                            type="text"
                            value={parseFloat(editedOption.price).toLocaleString('vi-VN')}
                            onChange={(e) => {
                                const rawValue = e.target.value.replace(/\D/g, '');
                                handleChange("price", Number(rawValue));
                            }}
                            className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor={`discounted_price-${option.id}`} className="block text-sm mb-1">Giá khuyến mãi</label>
                        <input
                            id={`discounted_price-${option.id}`}
                            type="text"
                            value={parseFloat(editedOption.discounted_price).toLocaleString('vi-VN')}
                            onChange={(e) => {
                                const rawValue = e.target.value.replace(/\D/g, '');
                                handleChange("discounted_price", Number(rawValue));
                            }}
                            className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
