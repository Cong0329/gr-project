import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDoctors } from "../../../../redux/doctorSlice";
import { fetchDepartments } from "../../../../redux/departmentSlice";
import { fetchSpecialistSchedules } from "../../../../redux/scheduleSlice";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useParams } from "react-router-dom";

const DoctorSchedules = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { name } = useParams();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [doctorType, setDoctorType] = useState("specialty"); // Thêm state để lưu loại bác sĩ

  // Get data từ Redux
  const {
    doctors,
    loading: doctorsLoading,
    error: doctorsError,
  } = useSelector((state) => state.doctors);

  const {
    departments,
    loading: departmentsLoading,
    error: departmentsError,
  } = useSelector((state) => state.departments);

  const {
    specialistSchedules,
    loading: schedulesLoading,
    error: schedulesError,
  } = useSelector((state) => state.schedules);

  // Load doctors và departments từ Redux
  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchDepartments());
  }, [dispatch]);

  // Load schedules khi thay đổi ngày hoặc loại bác sĩ
  useEffect(() => {
    dispatch(
      fetchSpecialistSchedules({
        type: doctorType,
        date: format(selectedDate, "yyyy-MM-dd"), // Thêm ngày nếu API hỗ trợ
      })
    );
  }, [dispatch, selectedDate, doctorType]);

  useEffect(() => {
    if (location.pathname.includes("specialty-detail")) {
      setDoctorType("specialty");
    } else if (location.pathname.includes("onlex-detail")) {
      setDoctorType("online");
    }
  }, [location.pathname]);

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Handle doctor type change
  const handleTypeChange = (type) => {
    setDoctorType(type);
  };

  const loading = doctorsLoading || departmentsLoading || schedulesLoading;
  const error = doctorsError || departmentsError || schedulesError;

  if (loading) {
    return <p className="text-center py-10">Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">Lỗi: {error}</p>;
  }

  // Lọc department dựa trên tên lấy từ URL
  const department = departments.find((dep) => dep.name === name);

  // Lọc bác sĩ theo department_id và doctor type
  const filteredDoctors = Array.from(
    new Set(specialistSchedules.map((schedule) => schedule.doctor?.id))
  )
    .map((id) => doctors.find((doctor) => doctor.id === id))
    .filter(
      (doctor) =>
        doctor?.type === doctorType && doctor?.department_id === department?.id
    );

  // Format date for display
  const formattedDate = format(selectedDate, "EEEE - dd/MM");

  return (
    <div className="bg-gray-50">
      <div className="container-fix-spe mx-auto py-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-800">
                {doctorType === "specialty"
                  ? "Khám chuyên khoa"
                  : "Khám chuyên khoa online"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="date"
                  className="border border-gray-300 p-2 rounded-md"
                  value={format(selectedDate, "yyyy-MM-dd")}
                  onChange={(e) => handleDateChange(new Date(e.target.value))}
                />
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="absolute right-3 top-3 text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => {
              // Lọc lịch cho bác sĩ này
              const doctorSchedules = specialistSchedules.filter(
                (schedule) => schedule.doctor?.id === doctor.id
              );

              return (
                <div
                  key={doctor.id}
                  className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-4"
                >
                  <div className="flex flex-col items-center w-full md:w-1/3">
                    <img
                      src={doctor.avatar || "https://via.placeholder.com/80"}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-full object-cover"
                      loading="lazy"
                    />
                    <h2 className="text-blue-600 font-bold text-lg text-center mt-2">
                      {doctor.name}
                    </h2>
                    <p className="text-gray-700 text-center">
                      {doctor.experience || ""}
                    </p>
                    <p className="text-gray-500 text-center">
                      {doctor.position || ""}
                    </p>
                    {doctor.department && (
                      <p className="text-gray-500 text-center">
                        {doctor.department.name}
                      </p>
                    )}
                    <p className="text-gray-500 text-center">
                      📍 {doctor.address || ""}
                    </p>
                  </div>

                  <div className="w-full md:w-2/3">
                    <div className="flex items-center mb-2">
                      <h3 className="text-gray-700 font-semibold">
                        📅 {formattedDate}
                      </h3>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h3 className="text-gray-700 font-semibold">LỊCH KHÁM</h3>
                      {doctorSchedules.length > 0 ? (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {doctorSchedules.map((schedule) => (
                            <span
                              key={schedule.id}
                              className={`text-gray-700 text-sm px-3 py-2 rounded-md text-center ${
                                schedule.status === "booked"
                                  ? "bg-red-300 cursor-not-allowed"
                                  : "bg-green-200 hover:bg-green-300 cursor-pointer"
                              }`}
                            >
                              {schedule.start_time} - {schedule.end_time}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-2 text-center">
                          <p className="text-gray-500 mb-2">
                            Không có lịch khám trong ngày này
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-gray-700">
                {doctorType === "specialty"
                  ? "Không tìm thấy bác sĩ chuyên khoa."
                  : "Không tìm thấy bác sĩ chuyên khoa online."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedules;
