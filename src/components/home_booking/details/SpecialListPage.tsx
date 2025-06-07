import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDepartments, Department } from "../../../redux/departmentSlice";
import { fetchDoctors } from "../../../redux/doctorSlice";
import { useNavigate, useLocation } from "react-router-dom";
import Breadcrumb from "./component_details/BreadCrumb";
import { Search, Calendar, UserRound, Clock, FileText } from "lucide-react";
import CoXuongKhop from "../../../assets/sections/Co_Xuong_Khop.webp";
import { AppDispatch, RootState } from "../../../redux/store";

const SpecialistPage = () => {
  const [categories, setCategories] = useState<Department[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch:AppDispatch = useDispatch();

  const { departments, loading: departmentLoading } = useSelector(
    (state:RootState) => state.departments
  );
  const { doctors, loading: doctorLoading } = useSelector(
    (state:RootState) => state.doctors
  );

  useEffect(() => {
    if (departments.length === 0) dispatch(fetchDepartments());
    if (doctors.length === 0) dispatch(fetchDoctors());
  }, [dispatch, departments.length, doctors.length]);

  useEffect(() => {
    if (doctorLoading || departmentLoading) return;

    const isSpecialtyPage = location.pathname.includes("specialty-list");

    if (isSpecialtyPage) {
      const specialtyDoctors = doctors.filter(
        (doctor) => doctor.type === "specialty"
      );

      const specialtyDepartmentIds = [
        ...new Set(specialtyDoctors.map((doc) => Number(doc.department_id))),
      ];

      const filteredDepartments = departments.filter((dept) =>
        specialtyDepartmentIds.includes(dept.id)
      );

      setCategories(filteredDepartments);
    } else {
      setCategories(departments);
    }
  }, [
    departments,
    doctors,
    doctorLoading,
    departmentLoading,
    location.pathname,
  ]);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container-fix-spe mx-auto px-4 sm:px-10">
          <Breadcrumb />

          <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl py-12 text-center mt-6 px-6 transition-all duration-300">
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
                  placeholder="Tìm kiếm chuyên mục"
                  className="pl-10 pr-3 py-2 border border-gray-200 focus:ring-2 focus:ring-blue-500 rounded-lg w-full"
                  // value={searchTerm}
                  // onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="absolute right-1 top-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-md transition-colors"
                  onClick={() => {}}
                >
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="specialty container-fix-spe mx-auto px-4 md:px-8 lg:px-16 py-12">
          <h2 className="text-2xl font-bold mb-8 text-gray-800 border-l-4 border-blue-500 pl-4">
            Danh sách chuyên khoa
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                onClick={() =>
                  navigate(
                    `/booking-home/specialty-detail/${encodeURIComponent(
                      category.name
                    )}`
                  )
                }
              >
                <div className="bg-blue-50 rounded-full mb-4 w-20 h-20">
                  {" "}
                  <img
                    src={category.image || CoXuongKhop}
                    alt={category.name}
                    className="w-full h-full rounded-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="text-gray-800 font-medium text-center">
                  {category.name}
                </p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mt-16 mb-8 text-gray-800 border-l-4 border-blue-500 pl-4">
            Bài viết nổi bật
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <img
                src={CoXuongKhop}
                alt="Bài viết sức khỏe"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <p className="text-blue-600 font-semibold mb-2">
                  Khám chuyên khoa
                </p>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Khi nào bạn cần đi khám chuyên khoa?
                </h3>
                <p className="text-gray-600">
                  Việc khám chuyên khoa giúp phát hiện và điều trị bệnh sớm. Tìm
                  hiểu khi nào bạn nên đi khám...
                </p>
                <button className="mt-4 text-blue-600 font-medium hover:text-blue-800">
                  Đọc thêm →
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <img
                src={CoXuongKhop}
                alt="Bài viết sức khỏe"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <p className="text-blue-600 font-semibold mb-2">
                  Điều trị chuyên sâu
                </p>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Những điều cần biết trước khi đặt lịch khám chuyên sâu
                </h3>
                <p className="text-gray-600">
                  Chuẩn bị kỹ lưỡng trước khi đến khám bệnh giúp tiết kiệm thời
                  gian và mang lại hiệu quả tốt hơn...
                </p>
                <button className="mt-4 text-blue-600 font-medium hover:text-blue-800">
                  Đọc thêm →
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <img
                src={CoXuongKhop}
                alt="Bài viết sức khỏe"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <p className="text-blue-600 font-semibold mb-2">
                  Kiến thức y tế
                </p>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Cách chọn bác sĩ chuyên khoa phù hợp với bệnh lý
                </h3>
                <p className="text-gray-600">
                  Việc chọn đúng bác sĩ chuyên khoa sẽ giúp quá trình điều trị
                  hiệu quả hơn và giảm thiểu thời gian chờ đợi...
                </p>
                <button className="mt-4 text-blue-600 font-medium hover:text-blue-800">
                  Đọc thêm →
                </button>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-16 mb-8 text-gray-800 border-l-4 border-blue-500 pl-4">
            Tại sao chọn khám chuyên khoa tại Health?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <UserRound className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">
                Bác sĩ chuyên khoa
              </h3>
              <p className="text-gray-600">
                Đội ngũ bác sĩ giàu kinh nghiệm, được đào tạo chuyên sâu tại các
                trung tâm y tế hàng đầu.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">
                Đặt lịch dễ dàng
              </h3>
              <p className="text-gray-600">
                Hệ thống đặt lịch thông minh, giúp bạn chọn thời gian phù hợp và
                tiết kiệm thời gian chờ đợi.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">
                Thời gian linh hoạt
              </h3>
              <p className="text-gray-600">
                Lịch khám linh hoạt, phù hợp với nhu cầu của mọi đối tượng bệnh
                nhân kể cả người đi làm.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">
                Hồ sơ y tế số
              </h3>
              <p className="text-gray-600">
                Hệ thống hồ sơ y tế số giúp theo dõi quá trình điều trị và lưu
                trữ thông tin một cách an toàn.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-blue-600 rounded-xl p-8 text-center text-white shadow-lg">
            <h2 className="text-3xl font-bold mb-4">
              Đặt lịch khám ngay hôm nay
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Chăm sóc sức khỏe chuyên nghiệp với đội ngũ bác sĩ hàng đầu. Đặt
              lịch khám để được tư vấn và điều trị kịp thời.
            </p>
            <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition shadow-md">
              Đặt lịch ngay
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecialistPage;
