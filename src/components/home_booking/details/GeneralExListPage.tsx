import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchServicePackages,
  selectAllPackages,
  selectLoadingStatus,
  selectError,
} from "../../../redux/servicePackageSlice";
import { Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "./component_details/BreadCrumb";

const GeneralExListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Sử dụng selectors từ slice mới
  const allPackages = useSelector(selectAllPackages);
  const loading = useSelector(selectLoadingStatus);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchServicePackages());
  }, [dispatch]);

  const generalPackages =
    allPackages && allPackages.length > 0
      ? allPackages.filter((pkg) => pkg.type === "general")
      : [];

  // Lọc gói dựa trên searchTerm
  const filteredPackages =
    generalPackages.length > 0
      ? generalPackages.filter((pkg) =>
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  const featuredPackage =
    generalPackages.length > 0
      ? generalPackages.find((pkg) => pkg.rating >= 4.7) || generalPackages[0]
      : null;

  const handlePackageClick = (packageName) => {
    navigate(
      `/booking-home/generalex-detail/${encodeURIComponent(packageName)}`
    );
  };

  const handleSearch = () => {
    // Thực hiện tìm kiếm - đã được xử lý thông qua state, có thể thêm logic tìm kiếm chi tiết nếu cần
    const resultsSection = document.getElementById("packages-results");
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (searchTerm.trim() && isSearchFocused) {
      const timer = setTimeout(() => {
        const resultsSection = document.getElementById("packages-results");
        if (resultsSection) {
          resultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300); // Delay để đảm bảo render xong kết quả

      return () => clearTimeout(timer);
    }
  }, [searchTerm, isSearchFocused]);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {isSearchFocused && (
        <div
          className="fixed inset-0 z-40 pointer-events-auto"
          onClick={() => setIsSearchFocused(false)}
          style={{
            background: "linear-gradient(rgba(241, 245, 249, 0.3)",
          }}
        />
      )}
      <div
        className={`container-fix-spe mx-auto px-4 sm:px-10 transition-all ${
          isSearchFocused ? "pt-32 md:pt-28" : ""
        }`}
      >
        <Breadcrumb className={isSearchFocused ? "z-50 relative" : ""} />

        <div
          className={`bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl py-12 text-center mt-6 px-6 transition-all duration-300 ${
            isSearchFocused
              ? `
              fixed inset-x-0 top-0 z-50 mx-0
              md:mx-auto md:max-w-4xl md:top-4 md:shadow-xl
              animate-popup
            `
              : ""
          }`}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800">
            Bạn đang tìm kiếm gì?
          </h1>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Khám phá các gói khám tổng quát chất lượng cao phù hợp với nhu cầu
            sức khỏe của bạn
          </p>
          <div className="mt-6 flex justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm chuyên mục..."
                className="pl-10 pr-3 py-3 border border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-lg w-full text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                className="absolute right-1 top-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                onClick={handleSearch}
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12" id="packages-results">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <div className="bg-red-50 p-4 rounded-lg inline-block">
                <p className="text-red-500 font-medium">{error}</p>
                <button
                  className="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => dispatch(fetchServicePackages())}
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-lg mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </span>
                  Bài viết nổi bật
                </h2>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="md:flex">
                    <div className="md:flex-shrink-0 md:w-2/5">
                      <img
                        src={
                          featuredPackage?.image ||
                          "https://via.placeholder.com/400x240"
                        }
                        alt="Bài viết sức khỏe"
                        className="h-64 w-full object-cover md:h-full"
                      />
                    </div>
                    <div className="p-6 md:p-8">
                      <span className="inline-block bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm font-medium">
                        Khám xét nghiệm
                      </span>
                      <h3 className="mt-3 text-xl font-bold text-gray-900 md:text-2xl">
                        Khi nào bạn cần đi khám xét nghiệm? Những điều cần biết
                        trước khi đặt lịch
                      </h3>
                      <p className="mt-4 text-gray-600">
                        Việc khám xét nghiệm giúp phát hiện và điều trị bệnh
                        sớm. Tìm hiểu khi nào bạn nên đi khám, cần chuẩn bị gì
                        và các xét nghiệm phù hợp với triệu chứng của bạn...
                      </p>
                      <div className="mt-6">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors">
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="bg-green-100 p-2 rounded-lg mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </span>
                  Gói khám tổng quát
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 opacity-100 transition-opacity duration-500">
                  {filteredPackages.map((pkg, index) => (
                    <div
                      key={pkg.id || index}
                      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center border border-gray-100"
                      onClick={() => handlePackageClick(pkg.name)}
                    >
                      <div className="w-16 h-16 flex items-center justify-center mb-4">
                        <img
                          src={pkg.image || "https://via.placeholder.com/64"}
                          alt={pkg.name}
                          className="w-16 h-16 rounded-full"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-gray-800 font-medium text-center">
                        {pkg.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralExListPage;
