import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchBar = () => {
  const seachName = "Omega3";
  const seachFind  = 153;
  return (
    <div className="bg-white shadow-sm p-3 rounded-lg flex flex-col items-start justify-center text-gray-700 text-md">
      <div className="flex items-center gap-2">
        <FaMagnifyingGlass color="blue-700" />
        Sản phẩm
      </div>
      <div className="">
        Tìm thấy <span className="font-medium">{seachFind}</span>  sản phẩm với từ khóa "<span className="font-medium">{seachName}</span>"
      </div>
    </div>
  );
};

export default SearchBar;
