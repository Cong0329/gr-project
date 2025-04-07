import { useParams } from "react-router-dom";
import Breadcrumb from "./component_details/BreadCrumb";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeneralExams } from "../../../redux/generalExSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const GeneralExDetail = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
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
              <p className="text-gray-700 text-base mb-4">
                {currentPackage.description ||
                  "Gói khám giúp đánh giá sức khỏe toàn diện, sàng lọc các bệnh lý phổ biến, phát hiện sớm để điều trị hiệu quả hơn."}
              </p>
              <ul className="text-gray-600 text-sm list-disc ml-5 space-y-1">
                <li>Khám tại Bệnh viện đa khoa uy tín</li>
                <li>Bác sĩ chuyên khoa, nhiều kinh nghiệm</li>
                <li>Tư vấn kỹ sau khi có kết quả</li>
              </ul>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Đánh giá:{" "}
                <span className="font-medium">
                  {currentPackage.rating} ★ ({currentPackage.reviews} đánh giá)
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Giá gói:{" "}
                <span className="text-red-600 font-semibold">
                  {currentPackage.price?.toLocaleString("vi-VN")}đ
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-blue-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-blue-800 mb-4">
            Đặt lịch khám
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày khám
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giờ khám
              </label>
              <select className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option>8:00 - 9:00</option>
                <option>9:00 - 10:00</option>
                {/* ... */}
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors">
                Đặt lịch ngay
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Nội dung gói khám
          </h2>

          <div className="bg-white shadow p-6 rounded-xl space-y-4">
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
