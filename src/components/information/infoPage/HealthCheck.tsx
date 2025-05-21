import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { getUserAppointment } from "../../../redux/appointmentSlice";
import { getUserPackageBooking } from "../../../redux/packageBookingRequestSlice";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

type AppointmentType = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  type: string;
  doctor?: {
    name: string;
    avatar_url: string;
    specialization: string;
  };
  serviceInfo?: {
    name: string;
    description?: string;
    fee?: number;
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
      avatar_url: string;
      specialization: string;
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
  specialization?: string;
  price?: number;
  avatarUrl?: string;
  originalData: AppointmentType | PackageBookingType;
}

export const HealthCheckPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [combinedAppointments, setCombinedAppointments] = useState<
    CombinedAppointment[]
  >([]);

  // Corrected Redux state selection
  const { appointments, loading: appointmentsLoading } = useSelector(
    (state: RootState) => state.appointments
  );
  const { bookingRequests, loading: bookingsLoading } = useSelector(
    (state: RootState) => state.packages
  );

  useEffect(() => {
    dispatch(getUserAppointment());
    dispatch(getUserPackageBooking());
  }, [dispatch]);

  useEffect(() => {
    // Combine appointments and package bookings when they change
    const combined: CombinedAppointment[] = [];

    // Process regular appointments
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
        specialization: appointment.doctor?.specialization,
        price: appointment.serviceInfo?.price || appointment.serviceInfo?.fee,
        avatarUrl: appointment.doctor?.avatar_url,
        originalData: appointment,
      });
    });

    // Process package bookings
    bookingRequests?.forEach((booking: PackageBookingType) => {
      combined.push({
        id: booking.id,
        date: booking.requested_date,
        time: booking.requested_time_slot,
        status: booking.status,
        type: "package",
        serviceName: booking.package?.name || "Gói khám",
        doctorName: booking.schedule?.doctor?.name,
        specialization: booking.schedule?.doctor?.specialization,
        price: booking.package?.price,
        avatarUrl: booking.schedule?.doctor?.avatar_url,
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
        return "text-yellow-600";
      case "confirmed":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      case "completed":
        return "text-blue-600";
      case "rejected":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      case "doctor_requested":
        return "text-purple-600";
      case "assigned":
        return "text-green-600";
      default:
        return "text-gray-600";
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

  const currentDate = new Date();

  const upcomingAppointments = combinedAppointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    return (
      appointmentDate >= currentDate ||
      (appointment.status !== "completed" &&
        appointment.status !== "cancelled" &&
        appointment.status !== "rejected")
    );
  });

  const pastAppointments = combinedAppointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    return (
      appointmentDate < currentDate ||
      appointment.status === "completed" ||
      appointment.status === "cancelled" ||
      appointment.status === "rejected"
    );
  });

  const displayAppointments =
    activeTab === "upcoming" ? upcomingAppointments : pastAppointments;

  displayAppointments.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return activeTab === "upcoming"
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="pt-2">
      <h2 className="text-2xl font-bold mb-6">Lịch khám của tôi</h2>

      <div className="border-b border-gray-200 mb-6 bg-white">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`py-2 px-1 ${
              activeTab === "upcoming"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Lịch sắp tới
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`py-2 px-1 ${
              activeTab === "past"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Lịch đã qua
          </button>
        </nav>

        {(appointmentsLoading || bookingsLoading) && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!appointmentsLoading &&
          !bookingsLoading &&
          displayAppointments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {activeTab === "upcoming"
                  ? "Bạn không có lịch khám sắp tới nào."
                  : "Bạn chưa có lịch khám nào trước đây."}
              </p>
            </div>
          )}

        <div className="space-y-4">
          {displayAppointments.map((appointment) => (
            <div
              key={`${appointment.type}-${appointment.id}`}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">
                    {appointment.serviceName}
                  </h3>

                  <p className="text-gray-600 mt-1">
                    {appointment.type === "package" ? "Gói khám" : "Lịch khám"}{" "}
                    |
                    {appointment.price
                      ? ` ${appointment.price.toLocaleString("vi-VN")}đ`
                      : " Chưa có giá"}
                  </p>

                  <div className="mt-3">
                    <div className="flex items-center mb-1">
                      <svg
                        className="w-4 h-4 text-gray-500 mr-2"
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
                      <span>{formatDate(appointment.date)}</span>
                    </div>

                    <div className="flex items-center mb-1">
                      <svg
                        className="w-4 h-4 text-gray-500 mr-2"
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
                      <span>{appointment.time}</span>
                    </div>

                    {appointment.doctorName && (
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-gray-500 mr-2"
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
                        <span>
                          Bác sĩ {appointment.doctorName}
                          {appointment.specialization &&
                            ` - ${appointment.specialization}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusColor(
                      appointment.status
                    )} bg-opacity-10`}
                  >
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>
              </div>

              {(appointment.status === "pending_payment" ||
                appointment.status === "pending") && (
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="px-4 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                    Hủy lịch
                  </button>
                  <button className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    {appointment.status === "pending_payment"
                      ? "Thanh toán"
                      : "Xác nhận"}
                  </button>
                </div>
              )}

              {appointment.status === "confirmed" && (
                <div className="mt-4 flex justify-end">
                  <button className="px-4 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                    Hủy lịch
                  </button>
                </div>
              )}

              {appointment.status === "completed" && (
                <div className="mt-4 flex justify-end">
                  <button className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Xem kết quả
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthCheckPage;
