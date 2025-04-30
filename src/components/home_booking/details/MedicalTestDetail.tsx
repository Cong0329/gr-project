import { useParams, useNavigate } from "react-router-dom";
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

const MedicalTestDetail = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const [showSchedule, setShowSchedule] = useState(false);
  const scheduleRef = useRef(null);

  const allPackages = useSelector(selectAllPackages);
  const loading = useSelector(selectLoadingStatus);
  const error = useSelector(selectError);

  // Filter packages to get only medical types
  const medicalTests = allPackages.filter((pkg) => pkg.type === "medical");

  const decodedName = decodeURIComponent(name || "Chuyên khoa");
  const currentTest = medicalTests.find((test) => test.name === decodedName);

  useEffect(() => {
    if (medicalTests.length === 0) {
      dispatch(fetchServicePackages());
    }
  }, [dispatch, medicalTests.length]);

  const handleScheduleClick = () => {
    setShowSchedule(true);

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
      <div className="w-full">
        <div className="container mx-auto px-4 sm:px-10">
          <Breadcrumb current={decodedName} />
          <Skeleton height={300} className="mt-6" />
          <Skeleton count={5} className="mt-4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-10">
        Đã xảy ra lỗi khi tải thông tin gói xét nghiệm: {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 pb-10">
      <div className="container-fix-spe mx-auto px-4 sm:px-10">
        <Breadcrumb current={decodedName} />

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 text-center text-white rounded-xl mt-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{decodedName}</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            {currentTest?.description || "Thông tin về gói xét nghiệm này"}
          </p>
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
              Đặt lịch xét nghiệm
            </h2>
            {/* <PackageSchedule packageData={currentTest} /> */}
            <PackageSchedule
              showSchedule={showSchedule}
              scheduleRef={scheduleRef}
              currentTest={currentTest}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Giới thiệu về {decodedName}
              </h2>
              <p className="text-gray-600 mb-6">
                {currentTest?.description ||
                  `Đây là gói xét nghiệm giúp bạn kiểm tra các chỉ số quan trọng để đảm bảo sức khỏe tổng quát.`}
              </p>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-blue-700 mb-3">
                  Danh mục xét nghiệm
                </h3>
                {currentTest?.details?.categories?.map((category, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {category.category}
                    </h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {category.items.map((item, i) => (
                        <li key={i}>
                          <strong>{item.name}: </strong>
                          {item.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-blue-50 rounded-lg p-6 h-full">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">
                  Thông tin quan trọng
                </h3>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
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
                    Thời gian nhận kết quả
                  </h4>
                  <p className="text-gray-600">
                    {currentTest?.resultTime || "24-48 giờ sau khi lấy mẫu"}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
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
                    Chuẩn bị trước xét nghiệm
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>Nhịn ăn 8-12 giờ trước xét nghiệm (nếu cần)</li>
                    <li>Mang theo giấy tờ tùy thân</li>
                    <li>Thông báo về các loại thuốc đang sử dụng</li>
                    {currentTest?.preparation && (
                      <li>{currentTest.preparation}</li>
                    )}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
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
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      ></path>
                    </svg>
                    Chi phí xét nghiệm
                  </h4>
                  <div className="bg-white rounded-md p-3 shadow-sm">
                    <span className="text-2xl font-bold text-blue-700">
                      {currentTest?.price
                        ? `${currentTest.price.toLocaleString("vi-VN")} VNĐ`
                        : "Liên hệ để biết giá"}
                    </span>
                    {currentTest?.originalPrice && (
                      <span className="text-gray-400 line-through ml-2">
                        {currentTest.originalPrice}
                      </span>
                    )}
                    {currentTest?.discount && (
                      <span className="ml-2 bg-red-100 text-red-600 text-sm py-1 px-2 rounded">
                        -{currentTest.discount}%
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleScheduleClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition duration-200 flex items-center justify-center group"
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
                    Đặt lịch hẹn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {currentTest?.details?.categories?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Chi tiết dịch vụ {decodedName}
            </h2>

            <div className="bg-white shadow p-6 rounded-xl space-y-6">
              {currentTest.details.categories.map((category, index) => (
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
                        {category.items?.map((item, itemIndex) => (
                          <tr
                            key={`item-${index}-${itemIndex}`}
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

export default MedicalTestDetail;
