import React, { useState } from "react";
import { DescriptionType, descriptionTypeLabels } from "../../Blog/type"; // enum bạn đưa
import { createPortal } from "react-dom";
import { X } from "lucide-react";
// Types
type Description =
    | {
        type: Exclude<DescriptionType, DescriptionType.INGREDIENTS>;
        title: string;
        description: string;
        image: File | null;
        url: string | null;
    }
    | {
        type: DescriptionType.INGREDIENTS;
        title: string;
        image: null;
        url: null;
        descriptions: {
            description: string[];
            ingredients: { name: string; value: string }[];
        };
    };

interface DescriptionModalProps {
    usedTypes: DescriptionType[];
    onClose: () => void;
    onSubmit: (desc: Description) => void;
}

// Component
export const ModalCreatSection: React.FC<DescriptionModalProps> = ({
    usedTypes,
    onClose,
    onSubmit,
}) => {
    const [selectedType, setSelectedType] = useState<DescriptionType | "">("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [url, setUrl] = useState<string | null>(null);

    const [descLines, setDescLines] = useState<string[]>([]);
    const [newDesc, setNewDesc] = useState("");

    const [ingredients, setIngredients] = useState<
        { name: string; value: string }[]
    >([]);
    const [newName, setNewName] = useState("");
    const [newValue, setNewValue] = useState("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImage(file);
        setUrl(file ? URL.createObjectURL(file) : null);
    };

    const addDesc = () => {
        if (newDesc.trim()) {
            setDescLines([...descLines, newDesc.trim()]);
            setNewDesc("");
        }
    };

    const removeDesc = (index: number) => {
        setDescLines(descLines.filter((_, i) => i !== index));
    };

    const addIngredient = () => {
        if (newName.trim() && newValue.trim()) {
            setIngredients([...ingredients, { name: newName.trim(), value: newValue.trim() }]);
            setNewName("");
            setNewValue("");
        }
    };

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const availableTypes = Object.values(DescriptionType).filter(
        (type) => !usedTypes.includes(type as DescriptionType)
    );

    const handleSubmit = () => {
        if (!title.trim()) return;

        if (selectedType === DescriptionType.INGREDIENTS) {
            if (!descLines.length || !ingredients.length) return;
            onSubmit({

                type: DescriptionType.INGREDIENTS,
                title,
                image: null,
                url: null,
                descriptions: {
                    description: descLines,
                    ingredients,
                },
            });
        } else if (selectedType) {
            if (!description.trim()) return;
            onSubmit({
                type: selectedType as Exclude<DescriptionType, DescriptionType.INGREDIENTS>,
                title,
                description,
                image,
                url,
            });
        }
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[100000]">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold mb-4">
                        {selectedType ? descriptionTypeLabels[selectedType] : 'Thêm mô tả sản phẩm'}
                    </h2>
                    <button className="flex-none text-red-500" onClick={onClose}>
                        <X size={20} />
                    </button>

                </div>

                {/* Step 1: Select Type */}
                {!selectedType && (
                    <div className="space-y-2">
                        <label className="block font-medium">Chọn loại mô tả:</label>
                        <select
                            className="border p-2 w-full"
                            value=""
                            onChange={(e) => setSelectedType(e.target.value as DescriptionType)}
                        >
                            <option disabled value="">-- Chọn loại --</option>
                            {availableTypes.map((type) => (
                                <option key={type} value={type}>
                                    {descriptionTypeLabels[type]}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Step 2: Form */}
                {selectedType && (
                    <div className="mt-4 space-y-4">
                        <input
                            className="border p-1 w-full"
                            placeholder="Tiêu đề"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        {selectedType === DescriptionType.INGREDIENTS ? (
                            <>
                                {/* Description Lines */}
                                <div className="space-y-1">
                                    <label className="font-medium">Mô tả dòng:</label>
                                    <div className="flex space-x-2">
                                        <input
                                            className="border p-1 flex-1"
                                            value={newDesc}
                                            onChange={(e) => setNewDesc(e.target.value)}
                                        />
                                        <button
                                            className="bg-blue-500 text-white px-2 rounded"
                                            onClick={addDesc}
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                    <ul className="list-disc pl-5">
                                        {descLines.map((line, i) => (
                                            <li key={i} className="flex justify-between items-center">
                                                {line}
                                                <button className="text-red-500" onClick={() => removeDesc(i)}>X</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Ingredients */}
                                <div className="space-y-1">
                                    <label className="font-medium">Thành phần:</label>
                                    <div className="flex space-x-2">
                                        <input
                                            className="border p-1 flex-1"
                                            placeholder="Tên"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                        />
                                        <input
                                            className="border p-1 flex-1"
                                            placeholder="Giá trị"
                                            value={newValue}
                                            onChange={(e) => setNewValue(e.target.value)}
                                        />
                                        <button
                                            className="bg-blue-500 text-white px-2 rounded"
                                            onClick={addIngredient}
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                    <ul className="list-disc pl-5">
                                        {ingredients.map((item, i) => (
                                            <li key={i} className="flex justify-between items-center">
                                                {item.name}: {item.value}
                                                <button className="text-red-500" onClick={() => removeIngredient(i)}>X</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <>
                                <input
                                    className="border p-1 w-full"
                                    type="file"
                                    onChange={handleImageChange}
                                />
                                <textarea
                                    className="border p-1 w-full"
                                    rows={4}
                                    placeholder="Mô tả"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </>
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                                onClick={onClose}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={handleSubmit}
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};
