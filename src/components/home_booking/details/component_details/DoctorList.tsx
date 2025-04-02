import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSchedule } from "../../../../redux/scheduleSlice";
import { fetchDoctors } from "../../../../redux/doctorSlice";
import { fetchDepartments } from "../../../../redux/departmentSlice";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useParams } from "react-router-dom";

const DoctorList = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { name } = useParams();
  console.log("🔍 department từ URL:", name);

  const {
    schedules,
    loading: scheduleLoading,
    error: scheduleError,
  } = useSelector((state) => state.schedule);
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
    dispatch(fetchSchedule());
    dispatch(fetchDoctors());
    dispatch(fetchDepartments());
  }, [dispatch]);

  if (doctorLoading || departmentLoading || scheduleLoading)
    return <p>Đang tải dữ liệu...</p>;
  if (doctorError || departmentError || scheduleError)
    return <p>Lỗi: {doctorError || departmentError || scheduleError}</p>;

  const isOnlinePage = location.pathname.includes("onlex");
  const departmentName = decodeURIComponent(name || "")
    .trim()
    .toLowerCase();

  const selectedDepartment = departments.find(
    (dept) => dept.name.trim().toLowerCase() === departmentName
  );

  const filteredDoctors = selectedDepartment
    ? doctors.filter(
        (doctor) =>
          Number(doctor.department_id) === selectedDepartment.id &&
          doctor.type === (isOnlinePage ? "online" : "specialty")
      )
    : [];

  const today = new Date();
  const formattedDate = format(today, "EEEE - dd/MM");

  return (
    <div className="container-fix-spe mx-auto py-6">
      <div className="mb-4 flex justify-end">
        <select className="border border-gray-300 p-2 rounded-md">
          <option>Toàn quốc</option>
        </select>
      </div>

      <div className="grid gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor, index) => {
            const doctorSchedule = schedules.filter(
              (schedule) => schedule.doctor_id === doctor.id
            );

            return (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-4"
              >
                <div className="flex flex-col items-center w-full md:w-1/3">
                  <img
                    src={doctor.avatar || "https://via.placeholder.com/80"}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-full object-cover"
                    loading="lazy"
                  />
                  <h2 className="text-blue-500 font-bold text-lg text-center mt-2">
                    {doctor.name}
                  </h2>
                  <p className="text-gray-700 text-center">
                    {doctor.experience}
                  </p>
                  <p className="text-gray-500 text-center">{doctor.position}</p>
                  <p className="text-gray-500 text-center">
                    {doctor.patientAge}
                  </p>
                  <p className="text-gray-500 text-center">
                    📍 {doctor.address}
                  </p>
                  <a href="#" className="text-blue-500 mt-2">
                    Xem thêm
                  </a>
                </div>

                <div className="w-full md:w-2/3">
                  <div className="flex items-center mb-2">
                    <h3 className="text-gray-700 font-semibold">
                      📅 {formattedDate}
                    </h3>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="text-gray-700 text-sm mx-2"
                    />
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-gray-700 font-semibold">LỊCH KHÁM</h3>
                    {doctorSchedule.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {doctorSchedule.map((time, idx) => (
                          <span
                            key={idx}
                            className={`text-gray-700 text-sm px-3 py-2 rounded-md text-center ${
                              time.status === "booked"
                                ? "bg-red-300"
                                : "bg-gray-200"
                            }`}
                          >
                            {time.start_time} - {time.end_time}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">
                        Đăng ký khám
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>Không có bác sĩ phù hợp.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorList;
