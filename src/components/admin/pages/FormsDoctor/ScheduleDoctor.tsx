import { useEffect, useState } from "react";
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
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CreateSchedule } from "./Components/CreateSchedule";

export const DoctorScheduleComponent = () => {
  const dispatch = useDispatch();
  const { mySchedules, loading, error } = useSelector(
    (state) => state.schedules
  );
  const { appointments } = useSelector((state) => state.appointments);

  // State để quản lý việc hiển thị thông tin patient
  const [expandedSchedules, setExpandedSchedules] = useState(new Set());

  const [activeTab, setActiveTab] = useState("upcoming");

  const [showCreateModal, setShowCreateModal] = useState(false);

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

  // Function để phân chia lịch theo thời gian
  const categorizeSchedules = (schedules) => {
    if (!schedules || !Array.isArray(schedules))
      return { upcoming: [], past: [] };

    const now = new Date();
    const upcoming = [];
    const past = [];

    schedules.forEach((schedule) => {
      const scheduleDateTime = new Date(
        `${schedule.date}T${schedule.start_time}`
      );

      if (scheduleDateTime >= now) {
        upcoming.push(schedule);
      } else {
        past.push(schedule);
      }
    });

    // Sắp xếp upcoming theo thời gian tăng dần, past theo thời gian giảm dần
    upcoming.sort(
      (a, b) =>
        new Date(`${a.date}T${a.start_time}`) -
        new Date(`${b.date}T${b.start_time}`)
    );
    past.sort(
      (a, b) =>
        new Date(`${b.date}T${b.start_time}`) -
        new Date(`${a.date}T${a.start_time}`)
    );

    return { upcoming, past };
  };

  // Toggle hiển thị thông tin patient
  const togglePatientInfo = (scheduleId) => {
    const newExpanded = new Set(expandedSchedules);
    if (newExpanded.has(scheduleId)) {
      newExpanded.delete(scheduleId);
    } else {
      newExpanded.add(scheduleId);
    }
    setExpandedSchedules(newExpanded);
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

  // Render schedule card
  const renderScheduleCard = (schedule) => {
    const patientInfo = getPatientInfoForSchedule(schedule);
    const isBooked = schedule.status === "booked";
    const isExpanded = expandedSchedules.has(schedule.id);

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

            {/* Service Info & Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                  {getTypeIcon(schedule.type)}
                  <span className="text-sm font-medium text-blue-700">
                    {schedule.doctor?.department?.name || "Khám tổng quát"}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div
                  className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                    schedule.status
                  )}`}
                >
                  {getStatusText(schedule.status)}
                </div>

                {/* Nút xem thông tin patient nếu đã đặt */}
                {isBooked && patientInfo?.dob && (
                  <button
                    onClick={() => togglePatientInfo(schedule.id)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200"
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {isExpanded ? "Ẩn thông tin" : "Xem bệnh nhân"}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Patient Info - Hiển thị khi expanded */}
            {isBooked && patientInfo && isExpanded && (
              <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-5 mt-4 border-l-4 border-blue-400">
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
                        <span>Sinh: {formatDateOfBirth(patientInfo.dob)}</span>
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
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Calendar className="w-12 h-12 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Chưa có lịch làm việc
      </h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        Hiện tại bạn chưa có lịch làm việc nào. Hãy tạo lịch làm việc để bệnh
        nhân có thể đặt lịch khám với bạn.
      </p>

      {/* Nút thêm lịch lớn trong empty state */}
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-6 h-6" />
          <span className="text-lg">Tạo lịch làm việc đầu tiên</span>
        </button>

        <p className="text-sm text-gray-400">
          Sau khi tạo lịch, bệnh nhân sẽ có thể đặt lịch khám với bạn
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header luôn hiển thị */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div className="flex items-center justify-between">
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

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Thêm lịch</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-64 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-blue-600 font-medium">
              Đang tải lịch làm việc...
            </p>
          </div>
        </div>

        <CreateSchedule
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header luôn hiển thị ngay cả khi có lỗi */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div className="flex items-center justify-between">
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

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Thêm lịch</span>
            </button>
          </div>
        </div>

        <div className="p-8">
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
              <div>
                <p className="text-red-600 font-medium mb-2">
                  Có lỗi xảy ra: {error}
                </p>
                <p className="text-red-500 text-sm">
                  Không thể tải lịch làm việc. Bạn vẫn có thể tạo lịch mới bằng
                  nút "Thêm lịch" phía trên.
                </p>
              </div>
            </div>
          </div>
        </div>

        <CreateSchedule
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </div>
    );
  }

  const { upcoming, past } = categorizeSchedules(mySchedules);
  const hasSchedules = mySchedules && mySchedules.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header với nút thêm - LUÔN hiển thị */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
        <div className="flex items-center justify-between">
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

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Thêm lịch</span>
          </button>
        </div>
      </div>

      <CreateSchedule
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Tab Navigation - CHỈ hiển thị khi có lịch */}
      {hasSchedules && (
        <div className="border-b border-gray-200">
          <div className="flex w-full px-8">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "upcoming"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Lịch sắp tới</span>
              <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                {upcoming.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("past")}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "past"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Lịch đã qua</span>
              <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {past.length}
              </span>
            </button>
          </div>
        </div>
      )}

      <div className="p-8">
        {!hasSchedules ? (
          // Empty state với nút thêm lịch nổi bật
          renderEmptyState()
        ) : (
          <div className="space-y-4">
            {/* Hiển thị lịch theo tab active */}
            {activeTab === "upcoming" && upcoming.length > 0 && (
              <>{upcoming.map(renderScheduleCard)}</>
            )}

            {activeTab === "past" && past.length > 0 && (
              <>{past.map(renderScheduleCard)}</>
            )}

            {/* Hiển thị message khi không có lịch trong tab hiện tại */}
            {((activeTab === "upcoming" && upcoming.length === 0) ||
              (activeTab === "past" && past.length === 0)) && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === "upcoming" ? (
                    <Clock className="w-8 h-8 text-gray-400" />
                  ) : (
                    <Calendar className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {activeTab === "upcoming"
                    ? "Chưa có lịch sắp tới"
                    : "Chưa có lịch đã qua"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {activeTab === "upcoming"
                    ? "Hiện tại bạn chưa có lịch làm việc nào sắp tới."
                    : "Bạn chưa có lịch làm việc nào đã hoàn thành."}
                </p>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span>Thêm lịch mới</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
