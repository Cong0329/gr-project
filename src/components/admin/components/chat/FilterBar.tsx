import { Search, Filter, Star } from "lucide-react";

export const FilterBar = ({ 
    searchTerm, 
    onSearchChange, 
    filterStatus, 
    onStatusChange, 
    filterRating, 
    onRatingChange 
  }: { 
    searchTerm: string, 
    onSearchChange: (value: string) => void,
    filterStatus: string, 
    onStatusChange: (value: string) => void,
    filterRating: number | null, 
    onRatingChange: (value: number | null) => void
  }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, nội dung, sản phẩm..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <div className="flex items-center">
            <Filter size={18} className="text-gray-400 mr-2" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="answered">Đã trả lời</option>
              <option value="unanswered">Chưa trả lời</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <Star size={18} className="text-gray-400 mr-2" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterRating === null ? '' : filterRating}
              onChange={(e) => onRatingChange(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">Tất cả đánh giá</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
          </div>
        </div>
      </div>
    );
  };