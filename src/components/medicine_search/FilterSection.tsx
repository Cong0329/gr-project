import { useState } from "react";
import { FaChevronDown, FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";

interface FilterItemProps {
  title: string;
  options: string[];
  type?: "checkbox" | "radio";
  selected: string[];
  onChange: (value: string) => void;
  hasSearch?: boolean;
}

const FilterItem: React.FC<FilterItemProps> = ({
  title,
  options,
  type = "checkbox",
  selected,
  onChange,
  hasSearch = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="border-b py-2">
      <button
        className="w-full flex justify-between items-center font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <FaChevronDown
          className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
            }`}
        />
      </button>

      {isOpen && (
        <div className="mt-2">
          {hasSearch && (
            <input
              type="text"
              className="w-full p-2 border rounded-md text-sm"
              placeholder="Tìm theo tên"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
          <div className="mt-2 space-y-2">
            {filteredOptions.slice(0, showAll ? filteredOptions.length : 4).map((opt) => (
              <label key={opt} className="flex items-center space-x-2">
                <input
                  type={type}
                  checked={selected.includes(opt)}
                  onChange={() => onChange(opt)}
                  className="w-4 h-4"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          {filteredOptions.length > 4 && (
            <button
              className="text-black mt-2 text-sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? <span className="flex items-center gap-1"><FaAngleDoubleUp />Thu gọn</span> : <span className="flex items-center gap-1"><FaAngleDoubleDown />Xem thêm</span>}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterItem;
