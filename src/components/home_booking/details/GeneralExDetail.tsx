import { useParams } from "react-router-dom";
import Breadcrumb from "./component_details/BreadCrumb";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeneralExams } from "../../../redux/generalExSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PackageSchedule from "./component_details/PackageSchedules";

const GeneralExDetail = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const [showSchedule, setShowSchedule] = useState(false);
  const scheduleRef = useRef(null);
  const { allPackages, loading, error } = useSelector(
    (state: any) => state.generalExams
  );

  const decodedName = decodeURIComponent(name || "Gói khám");

  const currentPackage = allPackages.find(
    (pkg: any) => decodeURIComponent(pkg.name) === decodedName
  );

  useEffect(() => {
    if (allPackages.length === 0) {
      dispatch(fetchGeneralExams());
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

  return (
    <div id="generalex-detail" className="w-full bg-gray-50 pb-10">
      <div className="container-fix-spe mx-auto px-4 sm:px-10">
        <Breadcrumb current={decodedName} />

        <div className="bg-white rounded-xl shadow-md p-6 mt-6 grid md:grid-cols-3 gap-6 ">
          <img
            src={currentPackage.image}
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
                <li>Khám tại Bệnh viện đa khoa uy tín</li>
                <li>Bác sĩ chuyên khoa, nhiều kinh nghiệm</li>
                <li>Tư vấn kỹ sau khi có kết quả</li>
              </ul>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Đánh giá:{" "}
                  <span className="font-medium">
                    {currentPackage.rating} ★ ({currentPackage.reviews} đánh
                    giá)
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Giá gói:{" "}
                  <span className="text-red-600 font-semibold">
                    {currentPackage.price?.toLocaleString("vi-VN")}đ
                  </span>
                </p>
              </div>
              {/* <button
                onClick={handleScheduleClick}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center group"
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
              </button> */}
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
            <PackageSchedule />
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
                  Danh sách dịch vụ
                </h3>
                <ul className="list-disc ml-6 text-gray-700 space-y-1">
                  {currentPackage.servicesIncluded?.map(
                    (service: any, index: number) => (
                      <li key={index} className="text-lg font-medium ">
                        {service.category}
                      </li>
                    )
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
                      {currentPackage.duration || "60-90 phút"}
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
                      <li>Nhịn ăn 8-12 giờ trước khi khám</li>
                      <li>Mang theo giấy tờ tùy thân</li>
                      <li>
                        Mang theo các kết quả khám, xét nghiệm trước đây (nếu
                        có)
                      </li>
                    </ul>
                  </div>

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

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Danh mục gói
          </h2>

          <div className="bg-white shadow p-6 rounded-xl space-y-6">
            {currentPackage.servicesIncluded?.map(
              (service: any, index: number) => (
                <div
                  key={index}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <h3 className="text-lg font-semibold text-blue-700 mb-3">
                    {service.category}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dịch vụ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mô tả
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thời gian
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {service.items.map((item, itemIndex) => (
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
                              {item.duration || "30 phút"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralExDetail;
