import { useEffect, useRef, useState } from "react";
export const CustomSelect = ({ options, placeholder, onSelect, value }: {
    options: any[];
    placeholder: string;
    onSelect: (value: any) => void;
    value: string;
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option: any | null) => {
        onSelect(option);
        setSearchTerm("");
        setIsOpen(false);
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };

    useEffect(() => {
        if (!isOpen) setSearchTerm("");
    }, [isOpen]);

    return (
        <div className="relative mb-2">
            <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                className="w-full p-2 border rounded"
                value={isOpen ? searchTerm : value}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (!isOpen) setIsOpen(true);
                    if (e.target.value === "") handleSelect(null);
                }}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 100)}
            />

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
                    {filteredOptions.map(option => (
                        <div
                            key={option.code}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelect(option);
                            }}
                        >
                            {option.name}
                        </div>
                    ))}
                    {filteredOptions.length === 0 && (
                        <div className="p-2 text-gray-500">Không tìm thấy kết quả</div>
                    )}
                </div>
            )}
        </div>
    );
};