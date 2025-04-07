import { useParams } from "react-router-dom";
import Breadcrumb from "./component_details/BreadCrumb";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMedicalTests } from "../../../redux/medicalTestSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MedicalTestDetail = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const { tests, loading, error } = useSelector(
    (state: any) => state.medicalTests
  );

  const decodedName = decodeURIComponent(name || "Chuyên khoa");
  const currentTest = tests.find(
    (test: any) => decodeURIComponent(test.name) === decodedName
  );

  useEffect(() => {
    if (tests.length === 0) {
      dispatch(fetchMedicalTests());
    }
  }, [dispatch, tests.length]);

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
    <div className="w-full bg-gray-50">
      <div className="container-fix-spe mx-auto px-4 sm:px-10">
        <Breadcrumb current={decodedName} />

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 text-center text-white rounded-xl mt-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{decodedName}</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            {currentTest?.description || "Thông tin về gói xét nghiệm này"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Giới thiệu về {decodedName}
              </h2>
              <p className="text-gray-600 mb-6">
                {currentTest?.description ||
                  `Đây là gói xét nghiệm giúp bạn kiểm tra các chỉ số quan trọng để đảm bảo sức khỏe tổng quát.`}
              </p>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-blue-700 mb-3">
                  Các danh mục xét nghiệm
                </h3>
                {currentTest?.details?.categories.map(
                  (category: any, index: number) => (
                    <div key={index} className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {category.category}
                      </h4>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        {category.items.map((item: any, i: number) => (
                          <li key={i}>
                            <strong>{item.name}: </strong>
                            {item.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Đặt lịch xét nghiệm
                </h3>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                  Đặt lịch ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mt-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Dịch vụ {decodedName}
          </h2>

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
                    Giá
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTest?.details?.categories?.map(
                  (category: any, index: number) => (
                    <>
                      <tr key={index} className="hover:bg-gray-50">
                        <td
                          className="px-6 py-4 whitespace-nowrap font-medium"
                          colSpan={3}
                        >
                          <strong>{category.category}</strong>
                        </td>
                      </tr>

                      {category.items.map((item: any, itemIndex: number) => (
                        <tr key={itemIndex} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {item.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Liên hệ
                          </td>{" "}
                        </tr>
                      ))}
                    </>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalTestDetail;
