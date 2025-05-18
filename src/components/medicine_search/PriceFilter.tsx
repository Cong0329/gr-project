import { useState } from "react";
import { FaFilter } from "react-icons/fa6";

const priceOptions = [
  { label: "Giá thấp", value: "asc" },
  { label: "Giá cao", value: "desc" },
];

interface PriceFilterProps {
  onSelect: (value: "asc" | "desc" | "none") => void;
  onClose: (value: boolean) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ onSelect, onClose }) => {
  const [selected, setSelected] = useState<"asc" | "desc" | "none">("none");

  const handleSelect = (value: "asc" | "desc") => {
    const newValue = selected === value ? "none" : value;
    setSelected(newValue);
    onSelect(newValue);
  };
  

  return (
    <div className="flex items-center tb:justify-between space-x-2 tb:w-full">
      <span className="text-gray-600 font-medium tb:hidden">Sắp xếp theo</span>
      <div className="flex gap-2 tb:flex-grow">
        {priceOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value as "asc" | "desc")}
            className={`px-2 py-1 rounded-full border mm:text-sm font-medium ${selected === option.value
              ? "bg-blue-100 text-blue-600 border-blue-500"
              : "text-gray-600 border-gray-300"
              } transition-all duration-300`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <button className="items-center justify-center gap-2 hidden tb:flex tb:flex-none" onClick={() => onClose(true)}>
        <FaFilter />
        Lọc
      </button>
    </div>

  );
};

export default PriceFilter;
