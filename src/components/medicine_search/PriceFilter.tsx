import { useState } from "react";

const priceOptions = [
  { label: "Bán chạy", value: "popular" },
  { label: "Giá thấp", value: "low" },
  { label: "Giá cao", value: "high" },
];

const PriceFilter: React.FC<{ onSelect: (value: string) => void }> = ({ onSelect }) => {
  const [selected, setSelected] = useState<string>("popular");

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-gray-600 font-medium">Sắp xếp theo</span>
      {priceOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSelect(option.value)}
          className={`px-2 py-1 rounded-full border font-medium ${
            selected === option.value
              ? "bg-blue-100 text-blue-600 border-blue-500"
              : "text-gray-600 border-gray-300"
          } transition-all duration-300`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default PriceFilter;
