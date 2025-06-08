import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyDoctorSchedules,
  updateSchedule,
} from "../../../../redux/scheduleSlice";
import { getDoctorAppointments } from "../../../../redux/appointmentSlice";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Stethoscope,
  Phone,
  Mail,
  Users,
  FileText,
  // CalendarDays,
  Plus,
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  X,
  AlertCircle,
  Heart,
} from "lucide-react";
import { CreateSchedule } from "./Components/CreateSchedule";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../../../redux/store";

export const DoctorScheduleComponent = () => {
  const dispatch: AppDispatch = useDispatch();
  const { mySchedules, loading, error } = useSelector(
    (state: RootState) => state.schedules
  );
  const { appointments } = useSelector(
    (state: RootState) => state.appointments
  );

  // State để quản lý việc hiển thị thông tin patient
  const [expandedSchedules, setExpandedSchedules] = useState(new Set());

  const [activeTab, setActiveTab] = useState("upcoming");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const navigate = useNavigate();

  // State để quản lý việc chỉnh sửa lịch
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editForm, setEditForm] = useState({
    date: "",
    start_time: "",
    end_time: "",
    status: "",
    note: "",
  });

  useEffect(() => {
    dispatch(fetchMyDoctorSchedules({}));
    dispatch(getDoctorAppointments());
  }, [dispatch]);

  // Function to find patient info for a schedule
  const getPatientInfoForSchedule = (schedule: any) => {
    if (!appointments || !Array.isArray(appointments)) return null;

    const appointment = appointments.find(
      (apt: any) =>
        apt.schedule_id === schedule.id && apt.status !== "cancelled"
    );

    return appointment || null;
  };

  // Function để phân chia lịch theo thời gian
  const categorizeSchedules = (schedules: any[]) => {
    if (!schedules || !Array.isArray(schedules))
      return { upcoming: [], past: [] };

    const now = new Date();
    const upcoming: any[] = [];
    const past: any[] = [];

    schedules.forEach((schedule: any) => {
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
        new Date(`${a.date}T${a.start_time}`).getTime() -
        new Date(`${b.date}T${b.start_time}`).getTime()
    );

    past.sort(
      (a, b) =>
        new Date(`${b.date}T${b.start_time}`).getTime() -
        new Date(`${a.date}T${a.start_time}`).getTime()
    );

    return { upcoming, past };
  };

  // Toggle hiển thị thông tin patient
  const togglePatientInfo = (scheduleId: any) => {
    const newExpanded = new Set(expandedSchedules);
    if (newExpanded.has(scheduleId)) {
      newExpanded.delete(scheduleId);
    } else {
      newExpanded.add(scheduleId);
    }
    setExpandedSchedules(newExpanded);
  };

  // Bắt đầu chỉnh sửa lịch
  const startEditSchedule = (schedule: any) => {
    setEditingSchedule(schedule.id);
    setEditForm({
      date: schedule.date,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      status: schedule.status,
      note: schedule.note || "",
    });
  };

  // Hủy chỉnh sửa
  const cancelEdit = () => {
    setEditingSchedule(null);
    setEditForm({
      date: "",
      start_time: "",
      end_time: "",
      status: "",
      note: "",
    });
  };

  // Lưu thay đổi
  const saveScheduleChanges = async (scheduleId: any) => {
    try {
      const formattedUpdateData = {
        ...editForm,
        start_time: editForm.start_time
          ? formatTime(editForm.start_time)
          : editForm.start_time,
        end_time: editForm.end_time
          ? formatTime(editForm.end_time)
          : editForm.end_time,
      };
      await dispatch(
        updateSchedule({
          scheduleId: scheduleId,
          updateData: formattedUpdateData,
        })
      ).unwrap();

      setEditingSchedule(null);
      setEditForm({
        date: "",
        start_time: "",
        end_time: "",
        status: "",
        note: "",
      });

      // Refresh lại danh sách lịch
      dispatch(fetchMyDoctorSchedules({}));
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert("Có lỗi xảy ra khi cập nhật lịch làm việc");
    }
  };

  // Xử lý thay đổi form
  const handleFormChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-green-100 text-green-800 border-green-200";
      case "available":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "booked":
        return "Đã đặt";
      case "available":
        return "Chưa đặt";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Đã hoàn thành";
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "specialist_online":
        return <Stethoscope className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getGenderIcon = (gender: string) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const formatDateOfBirth = (dobString: string) => {
    if (!dobString) return "";
    const date = new Date(dobString);
    return date.toLocaleDateString("vi-VN");
  };

  // Kiểm tra xem lịch có thể chỉnh sửa không
  const canEditSchedule = (schedule: any) => {
    const scheduleDateTime = new Date(
      `${schedule.date}T${schedule.start_time}`
    );
    const now = new Date();
    // Có thể chỉnh sửa nếu lịch chưa qua hoặc đang trong quá trình diễn ra
    return scheduleDateTime >= now || schedule.status === "available";
  };

  // Render form chỉnh sửa
  const renderEditForm = (schedule: any) => {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-yellow-600" />
            <h4 className="font-semibold text-yellow-800">
              Chỉnh sửa lịch làm việc
            </h4>
          </div>
          <button
            onClick={cancelEdit}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ngày */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày làm việc
            </label>
            <input
              type="date"
              value={editForm.date}
              onChange={(e) => handleFormChange("date", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Giờ bắt đầu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giờ bắt đầu
            </label>
            <input
              type="time"
              value={editForm.start_time}
              onChange={(e) => handleFormChange("start_time", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Giờ kết thúc */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giờ kết thúc
            </label>
            <input
              type="time"
              value={editForm.end_time}
              onChange={(e) => handleFormChange("end_time", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={editForm.status}
              onChange={(e) => handleFormChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="available">Chưa đặt</option>
              <option value="booked">Đã đặt</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          {/* Ghi chú */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              value={editForm.note}
              onChange={(e) => handleFormChange("note", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Thêm ghi chú cho lịch làm việc..."
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-3 mt-6">
          <button
            onClick={cancelEdit}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            <span>Hủy</span>
          </button>
          <button
            onClick={() => saveScheduleChanges(schedule.id)}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Save className="w-4 h-4" />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>
    );
  };

  // Render schedule card
  const renderScheduleCard = (schedule: any) => {
    const appointmentData = getPatientInfoForSchedule(schedule);
    const patientInfo = appointmentData?.patient_info || null;
    const isBooked = schedule.status === "booked";
    const isCompleted = schedule.status === "completed";
    const isExpanded = expandedSchedules.has(schedule.id);
    const isEditing = editingSchedule === schedule.id;
    const canEdit = canEditSchedule(schedule);

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

                {/* Nút chỉnh sửa */}
                {canEdit && !isEditing && (
                  <button
                    onClick={() => startEditSchedule(schedule)}
                    className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="text-sm font-medium">Chỉnh sửa</span>
                  </button>
                )}

                {/* Nút xem thông tin patient nếu đã đặt */}
                {isBooked && appointmentData && (
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

                {isCompleted && appointmentData && (
                  <button
                    onClick={() =>
                      navigate("/doctor/medical-record", {
                        state: {
                          patient: patientInfo,
                          patientId: appointmentData.user_id,
                          scheduleId: schedule.id,
                          appointmentId: appointmentData.id,
                          appointmentData: appointmentData,
                          scheduleData: schedule,
                        },
                      })
                    }
                    className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors duration-200"
                  >
                    Lập hồ sơ
                  </button>
                )}
              </div>
            </div>
            {/* Ghi chú nếu có */}
            {schedule.note && !isEditing && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300">
                <div className="flex items-start space-x-2">
                  <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Ghi chú:
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      {schedule.note}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* Form chỉnh sửa */}
            {isEditing && renderEditForm(schedule)}
            {/* Patient Info - Hiển thị khi expanded */}
            {isBooked && isExpanded && appointmentData && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Heart className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">
                    Thông tin bệnh nhân
                  </h4>
                </div>

                {patientInfo ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {getGenderIcon(patientInfo.gender)}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">
                          {patientInfo.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          ID: {appointmentData.user_id}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>
                          Ngày sinh: {formatDateOfBirth(patientInfo.dob)}
                        </span>
                      </div>

                      {patientInfo.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{patientInfo.phone}</span>
                        </div>
                      )}

                      {patientInfo.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{patientInfo.email}</span>
                        </div>
                      )}

                      {patientInfo.address && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{patientInfo.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Chưa có thông tin chi tiết bệnh nhân</span>
                    <span className="text-sm">
                      (User ID: {appointmentData.user_id})
                    </span>
                  </div>
                )}
              </div>
            )}
            {/* Cảnh báo nếu không thể chỉnh sửa */}
            {!canEdit && !isEditing && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-700">
                    Lịch này đã qua không thể chỉnh sửa
                  </span>
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
