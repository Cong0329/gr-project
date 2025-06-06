import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import chat from "../../../assets/chat.png";
import {
  getUserAppointment,
  cancelAppointment,
} from "../../../redux/appointmentSlice";
import {
  getUserPackageBooking,
  cancelBookingRequest,
} from "../../../redux/packageBookingRequestSlice";
import { format, parseISO, isAfter, isSameDay, parse } from "date-fns";
import { vi } from "date-fns/locale";
import { ChatModal } from "../ModalChat";

type AppointmentType = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  type: string;
  doctor?: {
    name: string;
    avatar: string;
    type: string;
    user_id: string;
  };
  serviceInfo?: {
    name: string;
    description?: string;
    price?: number;
  };
};

type PackageBookingType = {
  id: number;
  requested_date: string;
  requested_time_slot: string;
  status: string;
  package?: {
    name: string;
    description: string;
    price: number;
    type: string;
  };
  schedule?: {
    date: string;
    start_time: string;
    end_time: string;
    doctor?: {
      name: string;
      avatar: string;
      type: string;
      user_id: string;
    };
  };
};

interface CombinedAppointment {
  id: string | number;
  date: string;
  time: string;
  status: string;
  type: "appointment" | "package";
  serviceName: string;
  doctorName?: string;
  doctorId?: string;
  doctorType?: string;
  price?: number;
  avatar?: string;
  originalData: AppointmentType | PackageBookingType;
}

export const HealthCheckPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedAppointment, setSelectedAppointment] = useState<CombinedAppointment | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [combinedAppointments, setCombinedAppointments] = useState<
    CombinedAppointment[]
  >([]);

  const { appointments, loading: appointmentsLoading } = useSelector(
    (state: RootState) => state.appointments
  );
  const { bookingRequests, loading: bookingsLoading } = useSelector(
    (state: RootState) => state.packages
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    dispatch(getUserAppointment());
    dispatch(getUserPackageBooking());
  }, [dispatch]);

  useEffect(() => {
    const combined: CombinedAppointment[] = [];

    appointments?.forEach((appointment: AppointmentType) => {
      combined.push({
        id: appointment.id,
        date: appointment.date,
        time: `${appointment.start_time} - ${appointment.end_time}`,
        status: appointment.status,
        type: "appointment",
        serviceName:
          appointment.serviceInfo?.name ||
          getServiceTypeLabel(appointment.type),
        doctorName: appointment.doctor?.name,
        doctorId: appointment.doctor?.user_id,
        doctorType: appointment.doctor?.type,
        price: appointment.serviceInfo?.price,
        avatar: appointment.doctor?.avatar,
        originalData: appointment,
      });
    });

    bookingRequests?.forEach((booking: PackageBookingType) => {
      combined.push({
        id: booking.id,
        date: booking.requested_date,
        time: booking.requested_time_slot,
        status: booking.status,
        type: "package",
        serviceName: booking.package?.name || "Gói khám",
        doctorName: booking.schedule?.doctor?.name,
        doctorType: booking.schedule?.doctor?.type,
        doctorId: booking.schedule?.doctor?.user_id,
        price: booking.package?.price,
        avatar: booking.schedule?.doctor?.avatar,
        originalData: booking,
      });
    });

    setCombinedAppointments(combined);
  }, [appointments, bookingRequests]);

  const getServiceTypeLabel = (type: string): string => {
    switch (type) {
      case "specialist":
        return "Khám chuyên khoa";
      case "specialist_online":
        return "Khám chuyên khoa trực tuyến";
      case "general":
        return "Khám tổng quát";
      case "medical":
        return "Xét nghiệm";
      default:
        return "Dịch vụ khám";
    }
  };

  const getDoctorTypeLabel = (type: string): string => {
    switch (type) {
      case "specialist":
      case "specialty":
        return "Bác sĩ chuyên khoa";
      case "specialist_online":
      case "online":
        return "Bác sĩ chuyên khoa Online";
      default:
        return type || "Bác sĩ";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "pending_payment":
        return "Chờ thanh toán";
      case "confirmed":
        return "Đã xác nhận";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Hoàn thành";
      case "rejected":
        return "Từ chối";
      case "pending":
        return "Đang chờ";
      case "doctor_requested":
        return "Bác sĩ đã yêu cầu";
      case "assigned":
        return "Đã phân công";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending_payment":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "doctor_requested":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "assigned":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return format(date, "EEEE, dd/MM/yyyy", { locale: vi });
    } catch (e) {
      return dateStr;
    }
  };

  // Logic cải thiện cho việc phân loại lịch sắp tới và đã qua
  const isAppointmentUpcoming = (appointment: CombinedAppointment): boolean => {
    try {
      const appointmentDate = parseISO(appointment.date);
      const now = new Date();

      // Nếu cùng ngày, kiểm tra thời gian
      if (isSameDay(appointmentDate, now)) {
        // Parse thời gian bắt đầu từ chuỗi time
        const timeMatch = appointment.time.match(/^(\d{2}:\d{2})/);
        if (timeMatch) {
          const [hours, minutes] = timeMatch[1].split(":").map(Number);
          const appointmentDateTime = new Date(appointmentDate);
          appointmentDateTime.setHours(hours, minutes);

          return isAfter(appointmentDateTime, now);
        }
      }

      // Nếu khác ngày, so sánh ngày
      return isAfter(appointmentDate, now) || isSameDay(appointmentDate, now);
    } catch (e) {
      // Fallback: dựa vào status
      return !["completed", "cancelled", "rejected"].includes(
        appointment.status
      );
    }
  };

  const upcomingAppointments = combinedAppointments.filter(
    isAppointmentUpcoming
  );
  const pastAppointments = combinedAppointments.filter(
    (appointment) => !isAppointmentUpcoming(appointment)
  );

  const displayAppointments =
    activeTab === "upcoming" ? upcomingAppointments : pastAppointments;

  displayAppointments.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return activeTab === "upcoming"
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });

  const canCancelAppointment = (appointment: CombinedAppointment): boolean => {
    // Chỉ cho phép hủy lịch sắp tới và chưa hoàn thành/hủy
    return (
      isAppointmentUpcoming(appointment) &&
      !["completed", "cancelled", "rejected"].includes(appointment.status)
    );
  };

  // ✅ Hàm xử lý cancel cho cả 2 loại appointment
  const handleCancelAppointment = async (appointment: CombinedAppointment) => {
    const appointmentTypeName =
      appointment.type === "appointment" ? "lịch hẹn" : "yêu cầu đặt gói khám";

    const confirmCancel = window.confirm(
      `Bạn có chắc chắn muốn hủy ${appointmentTypeName} này không?`
    );
    if (!confirmCancel) return;

    // ✅ Nhập lý do hủy cho package booking
    let cancellationReason = "";
    if (appointment.type === "package") {
      cancellationReason = prompt("Vui lòng nhập lý do hủy (tùy chọn):") || "";
    }

    try {
      if (appointment.type === "appointment") {
        // ✅ Hủy appointment
        await dispatch(
          cancelAppointment({
            id: appointment.id.toString(),
          })
        ).unwrap();

        // Refresh appointment data
        dispatch(getUserAppointment());
      } else if (appointment.type === "package") {
        // ✅ Hủy package booking request
        await dispatch(
          cancelBookingRequest({
            bookingId: Number(appointment.id),
            cancellationReason: cancellationReason,
          })
        ).unwrap();

        // Refresh package booking data
        dispatch(getUserPackageBooking());
      }

      alert(`${appointmentTypeName} đã được hủy thành công.`);
    } catch (error: any) {
      console.error(`Lỗi khi hủy ${appointmentTypeName}:`, error);
      const errorMessage = error?.message || error || "Có lỗi xảy ra";
      alert(`Hủy ${appointmentTypeName} thất bại: ${errorMessage}`);
    }
  };

  const handlePayment = (appointment: CombinedAppointment) => {
    console.log("Thanh toán:", appointment);
  };

  const handleViewResults = (appointment: CombinedAppointment) => {
    console.log("Xem kết quả:", appointment);
  };

  return (
    <div className="pt-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Lịch khám của tôi</h1>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${activeTab === "upcoming"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="ms:text-sm">Lịch sắp tới</span>
                {upcomingAppointments.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {upcomingAppointments.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${activeTab === "past"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="ms:text-sm">Lịch đã qua</span>
                {pastAppointments.length > 0 && (
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                    {pastAppointments.length}
                  </span>
                )}
              </div>
            </button>
          </nav>
        </div>

        {/* Loading State */}
        {(appointmentsLoading || bookingsLoading) && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Đang tải...</span>
          </div>
        )}

        {/* Empty State */}
        {!appointmentsLoading &&
          !bookingsLoading &&
          displayAppointments.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === "upcoming"
                  ? "Không có lịch khám sắp tới"
                  : "Chưa có lịch sử khám"}
              </h3>
              <p className="text-gray-500">
                {activeTab === "upcoming"
                  ? "Bạn chưa có lịch khám nào được đặt trong thời gian tới."
                  : "Bạn chưa có lịch sử khám bệnh nào trước đây."}
              </p>
            </div>
          )}

        {/* Appointments List */}
        <div className="divide-y divide-gray-100">
          {displayAppointments.map((appointment) => (
            <>
              <div
                key={`${appointment.type}-${appointment.id}`}
                className="p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {appointment.serviceName}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h1m4 0h1"
                              />
                            </svg>
                            {appointment.type === "package"
                              ? "Gói khám"
                              : "Lịch khám"}
                          </span>
                          {appointment.price && (
                            <span className="flex items-center font-medium text-green-600">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                />
                              </svg>
                              {appointment.price.toLocaleString("vi-VN")}đ
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ms:text-[10px] ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {getStatusLabel(appointment.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-700">
                        <svg
                          className="w-5 h-5 text-blue-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="font-medium">
                          {formatDate(appointment.date)}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <svg
                          className="w-5 h-5 text-green-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium">{appointment.time}</span>
                      </div>

                      {appointment.doctorName && (
                        <div className="flex items-center text-gray-700 md:col-span-2">
                          <div className="flex items-center">
                            {appointment.avatar ? (
                              <img
                                src={appointment.avatar}
                                alt={appointment.doctorName}
                                className="w-5 h-5 rounded-full mr-3 object-cover"
                                onError={(e) => {
                                  // ✅ Fallback khi không load được avatar
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  target.nextElementSibling?.classList.remove(
                                    "hidden"
                                  );
                                }}
                              />
                            ) : null}
                            <svg
                              className={`w-5 h-5 text-purple-500 mr-3 ${appointment.avatar ? "hidden" : ""
                                }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span className="font-medium">
                              Bác sĩ {appointment.doctorName}
                              {appointment.doctorType && (
                                <span className="text-gray-500 ml-1">
                                  - {getDoctorTypeLabel(appointment.doctorType)}{" "}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ✅ Action Buttons - Updated logic */}
                    <div className="flex justify-end space-x-3">
                      {appointment.status === "pending_payment" && (
                        <>
                          {canCancelAppointment(appointment) && (

                            <button
                              onClick={() => handleCancelAppointment(appointment)}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Hủy{" "}
                              {appointment.type === "package"
                                ? "yêu cầu"
                                : "lịch"}
                            </button>

                          )}
                          <button
                            onClick={() => handlePayment(appointment)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                              />
                            </svg>
                            Thanh toán
                          </button>
                        </>
                      )}

                      {/* ✅ Handle cancel for different statuses - covers both appointment and package */}
                      <div className="flex gap-4">

                        {(appointment.status === "confirmed" ||
                          appointment.status === "pending" ||
                          appointment.status === "doctor_requested" ||
                          appointment.status === "assigned") &&
                          canCancelAppointment(appointment) && (
                            <button
                              onClick={() => handleCancelAppointment(appointment)}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Hủy{" "}
                              {appointment.type === "package" ? "yêu cầu" : "lịch"}
                            </button>
                          )}
                        <button className="h-10 w-10" onClick={() => {
                          setSelectedAppointment(appointment);
                          setIsModalOpen(true);
                        }}>
                          <img src={chat} alt="" />
                        </button>
                      </div>


                      {appointment.status === "completed" && (
                        <button
                          onClick={() => handleViewResults(appointment)}
                          className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-green-700 transition-colors duration-200"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Xem kết quả
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <ChatModal key={appointment.id} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Chat với bác sĩ ${selectedAppointment?.doctorName}`} id={selectedAppointment?.doctorId} />

            </>

          ))}
        </div>
      </div>
    </div>

  );
};

export default HealthCheckPage;
