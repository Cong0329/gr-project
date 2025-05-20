interface OptionValueInputProps {
    optionId: string;
    onAddValue: (optionId: string, value: string) => void;
}

export const OptionValueInput: React.FC<OptionValueInputProps> = ({ optionId, onAddValue }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && e.currentTarget.value.trim()) {
            onAddValue(optionId, e.currentTarget.value.trim());
            e.currentTarget.value = "";
        }
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const input = e.currentTarget.previousSibling as HTMLInputElement;
        if (input.value.trim()) {
            onAddValue(optionId, input.value.trim());
            input.value = "";
        }
    };

    return (
        <div className="flex">
            <input
                type="text"
                placeholder="Thêm giá trị..."
                className="flex-grow px-3 py-1 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={handleKeyDown}
            />
            <button
                type="button"
                className="bg-blue-100 text-blue-600 px-3 py-1 rounded-r"
                onClick={handleButtonClick}
            >
                Thêm
            </button>
        </div>    );
};