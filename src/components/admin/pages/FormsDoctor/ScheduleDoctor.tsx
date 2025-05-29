import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyDoctorSchedules } from "../../../../redux/scheduleSlice";
import { getUserAppointment } from "../../../../redux/appointmentSlice";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Badge,
  Stethoscope,
  Phone,
  Mail,
  Heart,
  Users,
  FileText,
  CalendarDays,
} from "lucide-react";

export const DoctorScheduleComponent = () => {
  const dispatch = useDispatch();
  const { mySchedules, loading, error } = useSelector(
    (state) => state.schedules
  );
  const { appointments } = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(fetchMyDoctorSchedules({}));
    dispatch(getUserAppointment());
  }, [dispatch]);

  // Function to find patient info for a schedule
  const getPatientInfoForSchedule = (schedule) => {
    if (!appointments || !Array.isArray(appointments)) return null;

    const appointment = appointments.find(
      (apt) => apt.schedule_id === schedule.id && apt.status !== "cancelled"
    );

    return appointment?.patient_info || null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "booked":
        return "bg-green-100 text-green-800 border-green-200";
      case "available":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "booked":
        return "Đã đặt";
      case "available":
        return "Chưa đặt";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "specialist_online":
        return <Stethoscope className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getGenderIcon = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
      case "nam":
        return "👨";
      case "female":
      case "nữ":
        return "👩";
      default:
        return "👤";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString.slice(0, 5);
  };

  const formatDateOfBirth = (dobString) => {
    if (!dobString) return "";
    const date = new Date(dobString);
    return date.toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-blue-600 font-medium">Đang tải lịch làm việc...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-red-600 font-medium">Lỗi: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Lịch làm việc của tôi
            </h1>
            <p className="text-blue-100 mt-1">
              Quản lý thời gian làm việc hiệu quả
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {!mySchedules || mySchedules.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Chưa có lịch làm việc
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Hiện tại bạn chưa có lịch làm việc nào được đặt. Hãy chờ bệnh nhân
              đặt lịch hoặc cập nhật lịch làm việc của bạn.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mySchedules.map((schedule) => {
              const patientInfo = getPatientInfoForSchedule(schedule);

              return (
                <div
                  key={schedule.id}
                  className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Date & Time */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Calendar className="w-5 h-5 text-blue-500" />
                          <span className="font-semibold">
                            {formatDate(schedule.date)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Clock className="w-5 h-5 text-blue-500" />
                          <span className="font-medium">
                            {formatTime(schedule.start_time)} -{" "}
                            {formatTime(schedule.end_time)}
                          </span>
                        </div>
                      </div>

                      {schedule.status === "booked" && patientInfo && (
                        <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-5 mb-4 border-l-4 border-blue-400">
                          <div className="flex items-center space-x-2 mb-3">
                            <Users className="w-5 h-5 text-blue-600" />
                            <h4 className="font-semibold text-blue-800">
                              Thông tin bệnh nhân
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Patient Basic Info */}
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">
                                  {getGenderIcon(patientInfo.gender)}
                                </span>
                                <div>
                                  <span className="font-medium text-gray-800">
                                    {patientInfo.name}
                                  </span>
                                  <span className="text-sm text-gray-600 ml-2">
                                    ({patientInfo.gender})
                                  </span>
                                </div>
                              </div>

                              {patientInfo.dob && (
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <CalendarDays className="w-4 h-4 text-blue-500" />
                                  <span>
                                    Sinh: {formatDateOfBirth(patientInfo.dob)}
                                  </span>
                                </div>
                              )}

                              {patientInfo.phone && (
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Phone className="w-4 h-4 text-green-500" />
                                  <span>{patientInfo.phone}</span>
                                </div>
                              )}

                              {patientInfo.email && (
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Mail className="w-4 h-4 text-orange-500" />
                                  <span>{patientInfo.email}</span>
                                </div>
                              )}
                            </div>

                            {/* Address & Reason */}
                            <div className="space-y-3">
                              {patientInfo.address && (
                                <div className="flex items-start space-x-2 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                                  <span>{patientInfo.address}</span>
                                </div>
                              )}

                              {patientInfo.reason && (
                                <div className="flex items-start space-x-2 text-sm">
                                  <FileText className="w-4 h-4 text-purple-500 mt-0.5" />
                                  <div>
                                    <span className="font-medium text-gray-700">
                                      Lý do khám:
                                    </span>
                                    <p className="text-gray-600 mt-1">
                                      {patientInfo.reason}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Doctor Info */}
                      {schedule.doctor && (
                        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
                          <div className="flex items-center space-x-4">
                            <img
                              src={schedule.doctor.avatar}
                              alt={schedule.doctor.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
                                <User className="w-4 h-4 text-blue-500" />
                                <span>{schedule.doctor.name}</span>
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {schedule.doctor.position}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>{schedule.doctor.experience}</span>
                                <span className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{schedule.doctor.address}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Service Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                            {getTypeIcon(schedule.type)}
                            <span className="text-sm font-medium text-blue-700">
                              {schedule.doctor?.department?.name ||
                                "Khám tổng quát"}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                            schedule.status
                          )}`}
                        >
                          {getStatusText(schedule.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
