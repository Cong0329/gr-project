import { useState } from "react";
import { Button } from "./Button";

interface Ingredient {
    name: string;
    value: string;
}

interface IngredientModalProps {
    onSubmit: (ingredient: Ingredient) => void;
    onClose: () => void;
}

export default function ModalAddIngredient({ onSubmit, onClose }: IngredientModalProps) {
    const [name, setName] = useState("");
    const [value, setValue] = useState("");

    const handleSubmit = () => {
        if (name.trim() && value.trim()) {
            onSubmit({ name, value });
            setName("");
            setValue("");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[100000]">
            <div className="p-4 bg-white rounded shadow-md w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">Thêm thành phần</h2>
                <div className="space-y-2">
                    <input
                        type="text"
                        value={name}
                        placeholder="Tên thành phần"
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        value={value}
                        placeholder="Giá trị (ví dụ: 500mg)"
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={onClose} variant="secondary">Hủy</Button>
                    <Button onClick={handleSubmit} variant="primary">Thêm</Button>
                </div>
            </div>
        </div>

    );
}
