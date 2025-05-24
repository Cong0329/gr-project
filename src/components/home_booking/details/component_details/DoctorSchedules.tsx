import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDoctors } from "../../../../redux/doctorSlice";
import { fetchDepartments } from "../../../../redux/departmentSlice";
import {
  fetchSpecialistSchedules,
  setSpecialistType,
} from "../../../../redux/scheduleSlice";
import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  parse,
  isAfter,
} from "date-fns";
import { vi } from "date-fns/locale";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faCalendarAlt,
  faUserMd,
  faHospital,
  faVideo,
  faClock,
  faMapMarkerAlt,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const DoctorSchedules = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { name } = useParams();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [hasDispatched, setHasDispatched] = useState(false);

  // Get data từ Redux
  const {
    doctors,
    loading: doctorsLoading,
    error: doctorsError,
  } = useSelector((state) => state.doctors);

  const { departments, loading: departmentsLoading } = useSelector(
    (state) => state.departments
  );

  const {
    specialistSchedules,
    loading: schedulesLoading,
    error: schedulesError,
    currentType,
  } = useSelector((state) => state.schedules);

  // Xác định loại bác sĩ từ URL và cập nhật vào Redux store
  useEffect(() => {
    const newType = /\/onlex-detail\//.test(location.pathname)
      ? "specialist_online"
      : "specialist";

    console.log(`Setting type to: ${newType}`);
    dispatch(setSpecialistType(newType));
  }, [location.pathname, dispatch]);

  // Load initial data
  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchDepartments());
  }, [dispatch]);

  // Fetch schedules whenever relevant parameters change
  useEffect(() => {
    if (!hasDispatched && departments.length > 0 && currentType) {
      const department = departments.find((dep) => dep.name === name);

      if (department) {
        const currentDateStr = format(selectedDate, "yyyy-MM-dd");

        console.log(
          `Fetching with type: ${currentType}, date: ${currentDateStr}`
        );

        dispatch(
          fetchSpecialistSchedules({
            type: currentType,
            date: currentDateStr,
            service_id: department.id,
          })
        );

        // Đánh dấu đã dispatch
        setHasDispatched(true);
      }
    }
  }, [departments, name, currentType, hasDispatched]);

  useEffect(() => {
    setHasDispatched(false);
  }, [selectedDate, name]);

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);

    // Khi thay đổi ngày, reset selectedDoctor và selectedSchedule
    setSelectedDoctor(null);
    setSelectedSchedule(null);
  };

  // Format ngày hiển thị thân thiện
  const formatDisplayDate = (date) => {
    if (isToday(date)) return "Hôm nay";
    if (isTomorrow(date)) return "Ngày mai";
    return format(date, "EEEE, dd/MM", { locale: vi });
  };

  // Lọc department dựa trên tên từ URL
  const department = departments.find((dep) => dep.name === name);

  // Tạo danh sách ngày khả dụng (7 ngày tiếp theo)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Xử lý dữ liệu từ API trả về
  // Giả sử rằng mỗi specialistSchedule có thông tin doctor được include từ API
  const groupedSchedules = {};

  // Nhóm lịch theo bác sĩ
  specialistSchedules.forEach((schedule) => {
    if (schedule.doctor) {
      if (!groupedSchedules[schedule.doctor.id]) {
        groupedSchedules[schedule.doctor.id] = {
          doctor: schedule.doctor,
          schedules: [],
        };
      }
      groupedSchedules[schedule.doctor.id].schedules.push(schedule);
    }
  });

  // Xử lý khi chọn một lịch khám - tự động cập nhật cả bác sĩ và lịch
  const handleScheduleSelection = (doctor, schedule) => {
    setSelectedDoctor(doctor);
    setSelectedSchedule(schedule);
  };

  // Xử lý khi nhấn nút tiếp tục
  const handleContinue = () => {
    if (selectedDoctor && selectedSchedule) {
      navigate("/booking-home/payment", {
        state: {
          packageInfo: {
            name: `Khám ${department?.name || "Chuyên khoa"} với BS. ${
              selectedDoctor.name
            }`,
            price: selectedDoctor.price || 500000,
            date: format(selectedDate, "yyyy-MM-dd"),
            time: `${selectedSchedule.start_time.slice(
              0,
              5
            )} - ${selectedSchedule.end_time.slice(0, 5)}`,
            formattedDate: formatDisplayDate(selectedDate),
            doctor: selectedDoctor,
            department: department,
            scheduleId: selectedSchedule.id,
            type: currentType,
            service_id:
              currentType === "specialist" ||
              currentType === "specialist_online"
                ? department?.id
                : selectedDoctor.service_package_id || department?.id,
            specialtyName: department?.name || "Chuyên khoa",
            previousPage: {
              url: window.location.pathname,
              type:
                currentType === "specialist_online"
                  ? "onlex-detail"
                  : "specialty-detail",
              name: department?.name || "Chuyên khoa",
            },
          },
        },
      });
    }
  };

  if (doctorsLoading || departmentsLoading || schedulesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (doctorsError || schedulesError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {doctorsError || schedulesError}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isTimePassedCurrent = (timeString) => {
    const now = new Date();
    const [hours, minutes] = timeString.split(":").map(Number);

    // So sánh với giờ hiện tại
    if (hours < now.getHours()) return true;
    if (hours === now.getHours() && minutes <= now.getMinutes()) return true;

    return false;
  };

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-6 py-12 sm:px-12 md:px-16 lg:px-20 xl:px-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {currentType === "specialist"
                  ? "Đặt lịch khám chuyên khoa"
                  : "Đặt lịch khám online"}
              </h1>
              <p className="text-gray-600 mt-1">
                {department?.name || "Chuyên khoa"}
              </p>
            </div>

            {/* Date Picker */}
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50"
              >
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-gray-500"
                />
                <span>{formatDisplayDate(selectedDate)}</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`text-gray-500 transition-transform ${
                    showDatePicker ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showDatePicker && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute z-10 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 w-64"
                >
                  <div className="p-3 grid grid-cols-3 gap-2">
                    {availableDates.map((date, index) => (
                      <button
                        key={index}
                        onClick={() => handleDateChange(date)}
                        className={`p-2 rounded-md text-center text-sm ${
                          format(selectedDate, "yyyy-MM-dd") ===
                          format(date, "yyyy-MM-dd")
                            ? "bg-blue-600 text-white"
                            : "bg-white hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <div>{format(date, "EEE", { locale: vi })}</div>
                        <div className="font-medium">
                          {format(date, "dd/MM")}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <div className="grid gap-6">
          {Object.values(groupedSchedules).length > 0 ? (
            Object.values(groupedSchedules).map(({ doctor, schedules }) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`bg-white rounded-xl shadow-md overflow-hidden ${
                  selectedDoctor?.id === doctor.id ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="p-6 flex flex-col md:flex-row gap-6">
                  {/* Doctor Info */}
                  <div className="flex flex-col items-center md:items-start md:w-1/3">
                    <img
                      src={doctor.avatar || "/default-doctor-avatar.jpg"}
                      alt={doctor.name}
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                      loading="lazy"
                    />
                    <h2 className="text-xl font-bold text-blue-600 mt-3 text-center md:text-left">
                      {doctor.name}
                    </h2>
                    <p className="text-gray-700 font-medium mt-1">
                      {doctor.position}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {doctor.experience} năm kinh nghiệm
                    </p>

                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                      <span>
                        {currentType === "online"
                          ? "Khám từ xa"
                          : doctor.address || "Bệnh viện Đa khoa Quốc tế"}
                      </span>
                    </div>
                  </div>

                  {/* Schedules */}
                  <div className="md:w-2/3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <FontAwesomeIcon icon={faClock} className="mr-2" />
                      Lịch khám ngày {formatDisplayDate(selectedDate)}
                    </h3>

                    {schedules.length > 0 ? (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {schedules.map((schedule) => {
                            // Thêm logic kiểm tra thời gian
                            const isTimeInPast =
                              isToday(selectedDate) &&
                              isTimePassedCurrent(schedule.start_time);

                            return (
                              <button
                                key={schedule.id}
                                onClick={() =>
                                  handleScheduleSelection(doctor, schedule)
                                }
                                disabled={
                                  schedule.status === "booked" || isTimeInPast
                                }
                                className={`p-2 rounded-lg text-center ${
                                  schedule.status === "booked" || isTimeInPast
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : selectedSchedule?.id === schedule.id &&
                                      selectedDoctor?.id === doctor.id
                                    ? "bg-blue-600 text-white"
                                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                }`}
                              >
                                {schedule.start_time.slice(0, 5)} -{" "}
                                {schedule.end_time.slice(0, 5)}
                              </button>
                            );
                          })}
                        </div>

                        {/* Inline Booking Button */}
                        {selectedDoctor?.id === doctor.id &&
                          selectedSchedule && (
                            <div className="mt-4 flex justify-end">
                              <div className="flex items-center mr-4">
                                <div className="text-right">
                                  <p className="font-medium text-gray-800">
                                    {formatDisplayDate(selectedDate)}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {selectedSchedule.start_time.slice(0, 5)} -{" "}
                                    {selectedSchedule.end_time.slice(0, 5)}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={handleContinue}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors flex items-center"
                              >
                                Tiếp tục
                                <FontAwesomeIcon
                                  icon={faArrowRight}
                                  className="ml-2"
                                />
                              </button>
                            </div>
                          )}
                      </>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-gray-500">
                          Bác sĩ không có lịch khám trong ngày này
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="text-gray-400 mb-4">
                <FontAwesomeIcon icon={faUserMd} size="3x" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {currentType === "specialist"
                  ? "Hiện không có bác sĩ chuyên khoa nào có lịch khám"
                  : "Hiện không có bác sĩ online nào có lịch khám"}
              </h3>
              <p className="text-gray-500">
                Vui lòng chọn ngày khác hoặc thử loại hình khám khác
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedules;
