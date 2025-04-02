import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Breadcrumb from "./component_details/BreadCrumb";
import { Search } from "lucide-react";
import CoXuongKhop from "../../../assets/sections/Co_Xuong_Khop.webp";
import { useSelector, useDispatch } from "react-redux";
import { fetchDoctors } from "../../../redux/doctorSlice";
import { fetchDepartments } from "../../../redux/departmentSlice";

const OnlExListPage = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    doctors,
    loading: doctorLoading,
    error: doctorError,
  } = useSelector((state) => state.doctors);
  const {
    departments,
    loading: departmentLoading,
    error: departmentError,
  } = useSelector((state) => state.departments);

  useEffect(() => {
    if (doctors.length === 0) dispatch(fetchDoctors());
    if (departments.length === 0) dispatch(fetchDepartments());
  }, [dispatch, doctors.length, departments.length]);

  useEffect(() => {
    if (doctorLoading || departmentLoading) return;

    const isOnlinePage = location.pathname.includes("onlex");

    if (isOnlinePage) {
      console.log("Filtering doctors with type 'online'...");
      const onlineDepartmentIds = doctors
        .filter((doctor) => doctor.type === "online")
        .map((doctor) => Number(doctor.department_id));

      console.log("Online department IDs:", onlineDepartmentIds);

      const filteredDepartments = departments.filter((dept) =>
        onlineDepartmentIds.includes(dept.id)
      );

      setCategories(filteredDepartments);
    } else {
      console.log("Setting all departments...");
      setCategories(departments);
    }
  }, [
    location.pathname,
    doctors,
    departments,
    doctorLoading,
    departmentLoading,
  ]);

  return (
    <>
      <div id="onlex-detail" className="w-full">
        <div className="onlex container-fix-spe mx-auto px-16">
          <Breadcrumb />
        </div>
        <div className="bg-blue-100 py-10 text-center">
          <h1 className="text-3xl font-bold" style={{ color: "#284a75" }}>
            Bạn đang tìm kiếm gì?
          </h1>
          <div className="mt-4 flex justify-center">
            <div className="relative w-2/3">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm chuyên mục"
                className="w-full py-2 pl-10 pr-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="onlex container-fix-spe mx-auto">
          <div className="onlex-content">
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 py-10">
              {categories.slice(0, 3).map((category, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer py-6"
                  onClick={() =>
                    navigate(
                      `/booking-home/onlex-detail/${encodeURIComponent(
                        category.name
                      )}`
                    )
                  }
                >
                  <img
                    src={CoXuongKhop}
                    alt={category.name}
                    className="w-16 h-16 mb-2"
                    loading="lazy"
                  />
                  <p className="text-gray-700 text-sm font-medium text-center">
                    {category.name}
                  </p>
                </div>
              ))}

              <div className="col-span-3 row-span-3 p-6 lg:row-start-2 bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Kiến thức chung
                </h2>

                <img
                  src={CoXuongKhop}
                  alt="Bài viết sức khỏe"
                  className="w-full h-60 object-cover rounded-lg"
                />

                <div className="mt-4">
                  <p className="text-blue-600 text-lg font-semibold">
                    Khám chuyên khoa
                  </p>
                  <h3 className="text-base font-bold text-gray-900">
                    Khi nào bạn cần đi khám chuyên khoa? Những điều cần biết
                    trước khi đặt lịch
                  </h3>
                  <p className="text-gray-600 text-md mt-1">
                    Việc khám chuyên khoa giúp phát hiện và điều trị bệnh sớm.
                    Tìm hiểu khi nào bạn nên đi khám, cần chuẩn bị gì và các
                    chuyên khoa phù hợp với triệu chứng của bạn...
                  </p>
                </div>
              </div>

              {categories.slice(3).map((category, index) => (
                <div
                  key={index + 3}
                  className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer py-6"
                  onClick={() =>
                    navigate(
                      `/booking-home/onlex-detail/${encodeURIComponent(
                        category.name
                      )}`
                    )
                  }
                >
                  <img
                    src={CoXuongKhop}
                    alt={category.name}
                    className="w-16 h-16 mb-2"
                    loading="lazy"
                  />
                  <p className="text-gray-700 text-sm font-medium text-center">
                    {category.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnlExListPage;
