interface InputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
    readOnly?: boolean;
    className?: string;
}

export const Input: React.FC<InputProps> = ({
    value,
    onChange,
    placeholder,
    label,
    required = false,
    readOnly = false,
    className = '',
}) => {
    const inputClasses = readOnly
        ? 'w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md'
        : 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';

    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={inputClasses}
                required={required}
                readOnly={readOnly}
            />
        </div>
    );
};