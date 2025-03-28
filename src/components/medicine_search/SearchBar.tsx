const SearchBar = () => {
    return (
      <div className="bg-white shadow-sm p-3 rounded-lg flex items-center">
        <input
          type="text"
          placeholder="Tìm tên thuốc, bệnh lý, thực phẩm chức năng..."
          className="w-full p-2 border rounded-lg focus:outline-none"
        />
        <button className="ml-2 p-2 bg-blue-600 text-white rounded-lg">
          🔍
        </button>
      </div>
    );
  };
  
  export default SearchBar;
  