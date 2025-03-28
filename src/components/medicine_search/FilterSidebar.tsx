const FilterSidebar = () => {
    return (
      <div className="bg-white p-4 shadow-sm rounded-lg">
        <h2 className="font-semibold text-lg">Bộ lọc nâng cao</h2>
  
        {/* Loại sản phẩm */}
        <div className="mt-3">
          <h3 className="font-semibold">Loại sản phẩm</h3>
          <ul className="mt-2 space-y-2">
            <li><input type="checkbox" /> Bổ sung Canxi</li>
            <li><input type="checkbox" /> Thuốc bổ</li>
            <li><input type="checkbox" /> Sữa</li>
          </ul>
        </div>
  
        {/* Giá */}
        <div className="mt-3">
          <h3 className="font-semibold">Giá bán</h3>
          <input type="range" className="w-full" />
        </div>
      </div>
    );
  };
  
  export default FilterSidebar;
  