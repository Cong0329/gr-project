import { useState, useRef, useEffect } from "react";

interface PackageSelectorProps {
  selectedOption: string;
  options: string[];  // Nhận danh sách các tùy chọn của sản phẩm
  onChange: (option: string) => void;
}

const PackageSelector: React.FC<PackageSelectorProps> = ({ selectedOption, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi bấm ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center justify-between border border-gray-300 rounded-full ml:px-2 ml:py-1 px-4 py-2 text-gray-700 hover:bg-gray-100 w-24"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption} <span className="ml-2">▼</span>
      </button>

      {isOpen && (
        <ul className="absolute left-0 w-24 bg-white border border-gray-300 rounded-lg shadow-md mt-2 z-10 ml:bottom-full mb-2">
          {options.map((option) => (
            <li
              key={option}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer hover:bg-blue-100"
              onClick={() => {
                onChange(option);  // Gọi hàm onChange khi chọn option
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
        
      )}
    </div>
  );
};

export default PackageSelector;
