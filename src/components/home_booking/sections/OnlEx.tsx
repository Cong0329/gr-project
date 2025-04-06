import { useState, useEffect } from "react";
import "./OnlEx.css";
import imgDt from "../../../assets/sections/doctor.jpg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../../redux/doctorSlice";
import { fetchDepartments } from "../../../redux/departmentSlice";

const OnlEx = () => {
  const options = [
    { label: "Tất cả", value: "Tất cả" },
    { label: "Tư vấn trị liệu tâm lý", value: "Tư vấn trị liệu tâm lý từ xa" },
    { label: "Sức khoẻ tâm thần", value: "Sức khoẻ tâm thần từ xa" },
    { label: "Tim mạch", value: "Tim mạch từ xa" },
    { label: "Da liễu", value: "Da liễu từ xa" },
    { label: "Tiêu hoá", value: "tiêu hoá từ xa" },
  ];

  const dispatch = useDispatch();
  const [activeOption, setActiveOption] = useState(0);

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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchDepartments());
  }, [dispatch]);

  if (doctorLoading || departmentLoading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (doctorError || departmentError) {
    return <p>Lỗi: {doctorError || departmentError}</p>;
  }

  const departmentMap = {};
  departments.forEach((dept) => {
    departmentMap[dept.id] = dept.name;
  });

  const processedDoctors = doctors.map((doctor) => ({
    ...doctor,
    departmentName: departmentMap[doctor.department_id] || "Không xác định",
  }));

  const filteredDoctors =
    activeOption === 0
      ? processedDoctors.filter((doctor) => doctor.type === "online")
      : processedDoctors.filter(
          (doctor) =>
            doctor.departmentName?.trim().toLowerCase() ===
              options[activeOption].value.trim().toLowerCase() &&
            doctor.type === "online"
        );

  return (
    <div id="onlex-section" className="w-full full-onl">
      <div className="container-lite mx-auto px-4 py-8">
        <div className="onl-title flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Tư vấn Online qua Video</h3>
          <Link to="/booking-home/onlex-list">
            <button className="text-[rgb(45,135,243)] font-semibold">
              Xem thêm<span className="ml-1">&gt;</span>
            </button>
          </Link>
        </div>
        <div className="flex flex-wrap gap-4">
          {options.map((option, index) => (
            <button
              key={index}
              className={`px-6 py-2 rounded-full transition-colors duration-300 border border-solid ${
                activeOption === index
                  ? "bg-[rgb(227,242,255)] text-[rgb(45,135,243)] border-[rgb(227,242,255)]"
                  : "bg-white border-[rgb(228,232,236)] text-[rgb(89,89,89)]"
              }`}
              onClick={() => setActiveOption(index)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="doctors mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDoctors.map((doctor, index) => (
            <div
              key={index}
              className="p-4 border rounded-xl flex flex-col bg-white"
            >
              <div className="flex flex-col items-center mb-4">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full mb-2"
                />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">
                    {doctor.departmentName}
                  </p>
                </div>
              </div>
              <div className="info-dt w-full bg-slate-100 rounded-lg pt-2 pb-4 px-4 mt-auto">
                <div className="flex items-start mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-[17px] h-[17px] mr-2 mt-1 flex-shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                  <span className="text-sm">{doctor.clinic}</span>
                </div>
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-[17px] h-[17px] mr-2 flex-shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                  <span className="text-sm">{doctor.address}</span>
                </div>
                <Link
                  to={`/booking-home/onlex-detail/${encodeURIComponent(
                    doctor.departmentName
                  )}`}
                  state={{ doctor }}
                  className="w-full"
                >
                  <button className="w-full bg-white text-[rgb(89,89,89)] font-semibold py-2 rounded-md hover:bg-[rgb(227,242,255)] transition-colors duration-300 border border-[rgb(153,153,153)]">
                    Đặt lịch khám
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnlEx;
