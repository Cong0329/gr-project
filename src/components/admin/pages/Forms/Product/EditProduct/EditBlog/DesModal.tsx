import { useState } from "react";
import { Button } from "./Button";

interface DescriptionModalProps {
    onSubmit: (text: string) => void;
    onClose: () => void;
}

export default function ModalAddDescription({ onSubmit, onClose }: DescriptionModalProps) {
    const [text, setText] = useState("");

    const handleSubmit = () => {
        if (text.trim()) {
            onSubmit(text);
            setText("");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[100000]">
            <div className="p-4 w-full max-w-md bg-white rounded">
                <h2 className="text-lg font-semibold mb-4">Thêm mô tả</h2>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Nhập mô tả..."
                />
                <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={onClose} variant="secondary">Hủy</Button>
                    <Button onClick={handleSubmit} variant="primary">Thêm</Button>
                </div>
            </div>
        </div>

    );
}
