import { useParams } from "react-router-dom";
import Breadcrumb from "./component_details/BreadCrumb";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchServicePackages,
  selectAllPackages,
  selectLoadingStatus,
  selectError,
} from "../../../redux/servicePackageSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PackageSchedule from "./component_details/PackageSchedules";
import { AppDispatch } from "../../../redux/store";

const GeneralExDetail = () => {
  const { name } = useParams();
  const dispatch:AppDispatch = useDispatch();
  const [showSchedule, setShowSchedule] = useState(false);
  const scheduleRef = useRef<HTMLDivElement>(null);


  // Sử dụng selectors từ slice mới
  const allPackages = useSelector(selectAllPackages);
  const loading = useSelector(selectLoadingStatus);
  const error = useSelector(selectError);

  const generalTests = allPackages.filter((pkg) => pkg.type === "general");
  const decodedName = decodeURIComponent(name || "Gói khám");
  const currentTest = generalTests.find((test) => test.name === decodedName);

  // Tìm gói khám hiện tại dựa trên tên
  const currentPackage = allPackages.find((pkg) => pkg.name === decodedName);

  useEffect(() => {
    if (allPackages.length === 0) {
      dispatch(fetchServicePackages());
    }
  }, [dispatch, allPackages.length]);

  const handleScheduleClick = () => {
    setShowSchedule(true);

    // Thêm timeout nhỏ để đảm bảo animation bắt đầu trước khi cuộn
    setTimeout(() => {
      if (scheduleRef.current) {
        scheduleRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  if (loading) {
    return (
      <div id="generalex-detail" className="w-full">
        <div className="container mx-auto px-4 sm:px-10">
          <Breadcrumb />
          <Skeleton height={300} className="mt-6" />
          <Skeleton count={5} className="mt-4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-10">
        Đã xảy ra lỗi khi tải thông tin gói khám: {error}
      </div>
    );
  }

  if (!currentPackage) {
    return (
      <div className="text-center py-10">
        Không tìm thấy thông tin gói khám "{decodedName}"
      </div>
    );
  }

  // Lấy danh mục và dịch vụ từ cấu trúc mới
  const getServiceCategories = (currentPackage: any) => {
    if (!currentPackage) return [];

    // Nếu đã có sẵn cấu trúc details.categories
    if (
      currentPackage.details?.categories &&
      Array.isArray(currentPackage.details.categories)
    ) {
      return currentPackage.details.categories;
    }

    // Nếu không có, tạo từ mối quan hệ items
    if (currentPackage.items && Array.isArray(currentPackage.items)) {
      // Nhóm items theo category
      const itemsByCategory: any = {};

      currentPackage.items.forEach((item: any) => {
        const categoryId = item.categoryId;
        const categoryName = item.category?.name || "Không phân loại";

        if (!itemsByCategory[categoryId]) {
          itemsByCategory[categoryId] = {
            category: categoryName,
            items: [],
          };
        }

        itemsByCategory[categoryId].items.push({
          name: item.name,
          description: item.description,
          duration: item.duration,
        });
      });

      return Object.values(itemsByCategory);
    }

    return [];
  };

  const serviceCategories = getServiceCategories(currentPackage);
  console.log("currentPackage:", currentPackage);
  console.log("serviceCategories:", serviceCategories);

  return (
    <div id="generalex-detail" className="w-full bg-gray-50 pb-10">
      <div className="container-fix-spe mx-auto px-4 sm:px-10">
        <Breadcrumb />

        <div className="bg-white rounded-xl shadow-md p-6 mt-6 grid md:grid-cols-3 gap-6 ">
          <img
            src={currentPackage.image || "https://via.placeholder.com/400x240"}
            alt={currentPackage.name}
            className="w-full h-64 object-cover rounded-xl col-span-1"
          />

          <div className="col-span-2 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-800 mb-2">
                {currentPackage.name}
              </h1>
              <p className="text-gray-700 text-lg mb-4">
                {currentPackage.description ||
                  "Gói khám giúp đánh giá sức khỏe toàn diện, sàng lọc các bệnh lý phổ biến, phát hiện sớm để điều trị hiệu quả hơn."}
              </p>
              <ul className="text-gray-600 text-base list-disc ml-5 space-y-1">
                {currentPackage.availableLocations &&
                  currentPackage.availableLocations.length > 0 && (
                    <li>
                      Khám tại: {currentPackage.availableLocations.join(", ")}
                    </li>
                  )}
                <li>Bác sĩ chuyên khoa, nhiều kinh nghiệm</li>
                <li>Tư vấn kỹ sau khi có kết quả</li>
                {currentPackage.target && (
                  <li>Đối tượng: {currentPackage.target}</li>
                )}
              </ul>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Đánh giá:{" "}
                  <span className="font-medium">
                    {currentPackage.rating || 4.5} ★ (
                    {currentPackage.reviews || 0} đánh giá)
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Giá gói:{" "}
                  <span className="text-red-600 font-semibold">
                    {currentPackage.price?.toLocaleString("vi-VN") || 0}đ
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={scheduleRef}
          className="mt-10 overflow-hidden transition-all duration-700 ease-in-out"
          style={{
            maxHeight: showSchedule ? "2000px" : "0",
            opacity: showSchedule ? 1 : 0,
            transform: showSchedule ? "translateY(0)" : "translateY(-20px)",
            marginBottom: showSchedule ? "2rem" : "0",
          }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              Đặt lịch khám sức khỏe
            </h2>
            {/* <PackageSchedule
              showSchedule={showSchedule}
              scheduleRef={scheduleRef}
              currentTest={currentTest}
            /> */}
             <PackageSchedule
              currentTest={currentTest}
            />
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Nội dung gói khám
          </h2>

          <div className="bg-white shadow p-6 rounded-xl space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">
                  Danh sách danh mục
                </h3>
                <ul className="list-disc ml-6 text-gray-700 space-y-1">
                  {serviceCategories.length > 0 ? (
                    serviceCategories.map((category: any, index: number) => (
                      <li key={index} className="text-lg font-medium">
                        {category.category}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">
                      Không có thông tin chi tiết
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-blue-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700 mb-3">
                  Thông tin gói khám
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      Thời gian khám
                    </h4>
                    <p className="text-gray-600">
                      {currentPackage.totalDuration
                        ? `${currentPackage.totalDuration} phút`
                        : currentPackage.duration
                        ? `${currentPackage.duration} phút`
                        : "60-90 phút"}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-1 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                      Chuẩn bị trước khám
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      {currentPackage.preparation ? (
                        <li>{currentPackage.preparation}</li>
                      ) : (
                        <>
                          <li>Nhịn ăn 8-12 giờ trước khi khám</li>
                          <li>Mang theo giấy tờ tùy thân</li>
                          <li>
                            Mang theo các kết quả khám, xét nghiệm trước đây
                            (nếu có)
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  {currentPackage.type === "medical" &&
                    currentPackage.resultTime && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1 flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          Thời gian có kết quả
                        </h4>
                        <p className="text-gray-600">
                          {currentPackage.resultTime}
                        </p>
                      </div>
                    )}

                  <div>
                    <button
                      onClick={handleScheduleClick}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition duration-200 flex items-center justify-center group mt-4"
                    >
                      <svg
                        className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      Đặt lịch khám
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {serviceCategories.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Chi tiết dịch vụ
            </h2>

            <div className="bg-white shadow p-6 rounded-xl space-y-6">
              {serviceCategories.map((category: any, index: number) => (
                <div
                  key={index}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <h3 className="text-lg font-semibold text-blue-700 mb-3">
                    {category.category}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dịch vụ
                          </th>
                          <th className="w-1/2 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mô tả
                          </th>
                          <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thời gian
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {category.items &&
                          category.items.map((item: any, itemIndex: number) => (
                            <tr
                              key={itemIndex}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                {item.name}
                              </td>
                              <td className="px-6 py-4 text-gray-500">
                                {item.description || "Không có mô tả"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                {item.duration
                                  ? `${item.duration} phút`
                                  : "30 phút"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralExDetail;
