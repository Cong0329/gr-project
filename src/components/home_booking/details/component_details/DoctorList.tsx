import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSchedule } from "../../../../redux/scheduleThunks";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useParams } from "react-router-dom";

const DoctorList = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { name } = useParams();
  console.log("🔍 department từ URL:", name);

  const { schedules, loading, error } = useSelector((state) => state.schedule);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorRes = await fetch(
          "https://run.mocky.io/v3/c2ec429b-94b8-40bf-8826-c398f1f44664"
        );
        const departmentRes = await fetch(
          "https://run.mocky.io/v3/3be6a135-0ba8-45e2-b86d-745fa3d30efd"
        );

        const doctorData = await doctorRes.json();
        const departmentData = await departmentRes.json();

        const isOnlinePage = location.pathname.includes("onlex");
        const departmentName = decodeURIComponent(name || "")
          .trim()
          .toLowerCase();

        if (isOnlinePage) {
          const onlineDoctors = doctorData.filter(
            (doctor) => doctor.type === "online"
          );

          const selectedDepartment = departmentData.find(
            (dept) => dept.name.trim().toLowerCase() === departmentName
          );

          const filteredDoctors = selectedDepartment
            ? onlineDoctors.filter(
                (doctor) =>
                  Number(doctor.department_id) === selectedDepartment.id
              )
            : [];

          setDoctors(filteredDoctors);
          setDepartments(departmentData);
        } else {
          const specialtyDoctors = doctorData.filter(
            (doctor) => doctor.type === "specialty"
          );

          const selectedDepartment = departmentData.find(
            (dept) => dept.name.trim().toLowerCase() === departmentName
          );

          const filteredDoctors = selectedDepartment
            ? specialtyDoctors.filter(
                (doctor) =>
                  Number(doctor.department_id) === selectedDepartment.id
              )
            : [];

          setDoctors(filteredDoctors);
          setDepartments(departmentData);
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      }
    };

    fetchDoctors();
  }, [location.pathname, name]);

  if (loading) return <p>Đang tải lịch khám...</p>;
  if (error) return <p>Lỗi: {error}</p>;

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
        {doctors.length > 0 ? (
          doctors.map((doctor, index) => (
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
                <p className="text-gray-700 text-center">{doctor.experience}</p>
                <p className="text-gray-500 text-center">{doctor.position}</p>
                <p className="text-gray-500 text-center">{doctor.patientAge}</p>
                <p className="text-gray-500 text-center">📍 {doctor.address}</p>
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
                  {doctor.schedule && doctor.schedule.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {doctor.schedule.map((time, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-200 text-gray-700 text-sm px-3 py-2 rounded-md text-center"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">
                      Đăng ký khám
                    </button>
                  )}
                </div>

                <div className="mt-4">
                  <p className="font-bold text-gray-800">{doctor.clinic}</p>
                  <p className="text-gray-600">{doctor.address}</p>
                  <p className="text-gray-800 font-semibold">
                    Giá khám: {doctor.price}{" "}
                    <a href="#" className="text-blue-500">
                      Xem chi tiết
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Không có bác sĩ phù hợp.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorList;
