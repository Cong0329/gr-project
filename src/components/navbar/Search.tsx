import { useState, useEffect, useRef } from "react";
import { X, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  
  const searchContainerRef = useRef(null);
  
  useEffect(() => {
    // Load search history from localStorage
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setSearchHistory(history);
    
    // Add event listener to close history when clicked outside
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsHistoryOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleSearch = () => {
    const trimmed = search.trim();
    if (!trimmed) return;
    
    // Save to search history in localStorage
    const updatedHistory = [trimmed, ...searchHistory.filter(item => item !== trimmed)].slice(0, 10);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
    navigate(`/medicine-search?name=${encodeURIComponent(trimmed)}`);
    setIsHistoryOpen(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  const handleClearHistory = () => {
    localStorage.removeItem("searchHistory");
    setSearchHistory([]);
  };
  
  const handleSelectHistory = (term: string) => {
    setSearch(term);
    setIsHistoryOpen(false);
  
    // Điều hướng sau một tick để đảm bảo state đã được cập nhật
    setTimeout(() => {
      navigate(`/medicine-search?name=${encodeURIComponent(term)}`);
    }, 0);
  };
  
  
  const handleFocus = () => {
    setIsHistoryOpen(true);
  };

  
  
  return (
    <div className="w-full max-w-3xl mx-auto relative" ref={searchContainerRef}>
      {/* Search Input */}
      <div className="relative w-full mx-auto bg-white rounded-full shadow-md">
        <input
          placeholder="Tìm tên thuốc"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="text-black rounded-full w-full h-full bg-transparent py-3 pl-5 pr-32 outline-none border border-gray-200"
          type="text"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-12 top-3 h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center"
          >
            <X size={16} />
          </button>
        )}
        <button
          type="submit"
          onClick={handleSearch}
          className="text-blue-800 absolute right-0 top-0 h-10 w-10 bg-blue-200 rounded-full mr-1 my-1 flex items-center justify-center hover:bg-blue-300"
        >
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
      
      {/* Search History Panel */}
      {isHistoryOpen && (
        <div className="absolute top-14 left-0 w-full bg-white rounded-lg shadow-lg z-10 border border-gray-200 ">
          <div className="p-4 pb-2">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-gray-600 font-medium">Lịch sử tìm kiếm</h3>
              <button 
                onClick={handleClearHistory}
                className="text-blue-600 text-sm hover:underline">
                Xóa tất cả
              </button>
            </div>
            
            <div className="space-y-2">
              {searchHistory.length > 0 ? (
                searchHistory.slice(0, 5).map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center py-1.5 px-2 text-black hover:bg-gray-100 rounded-md cursor-pointer"
                    onClick={() => handleSelectHistory(item)}
                  >
                    <Clock size={16} className="text-gray-400 mr-2" />
                    <span>{item}</span>
                    <button 
                      className="ml-auto text-gray-400 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newHistory = searchHistory.filter((_, i) => i !== index);
                        setSearchHistory(newHistory);
                        localStorage.setItem("searchHistory", JSON.stringify(newHistory));
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm py-1">Chưa có lịch sử tìm kiếm</p>
              )}
            </div>
          </div>
          
        
        </div>
      )}
    </div>
  );
}