import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookingRequests } from "../../../../redux/packageBookingRequestSlice";
import { requestDoctorAssignment } from "../../../../redux/doctorAssignmentSlice";
import { fetchMyDoctorInfo } from "../../../../redux/doctorSlice";
import {
  Calendar,
  Clock,
  Search,
  Package,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Stethoscope,
} from "lucide-react";
import { RootState, AppDispatch } from "../../../../redux/store";

export const ExaminationRequest = () => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [packageName, setPackageName] = useState("");
  const { bookingRequests, loading } = useSelector(
    (state: RootState) => state.packages || {}
  );
  const { loading: assignmentLoading } = useSelector(
    (state: RootState) => state.doctorAssignment || {}
  );
  const { info } = useSelector((state: RootState) => state.doctors || {});

  useEffect(() => {
    handleSearch();
    dispatch(fetchMyDoctorInfo());
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(
      getAllBookingRequests({
        date: selectedDate,
        packageId: packageName ? Number(packageName) : undefined,
      })
    );
  };

  // Function để phân chia yêu cầu theo thời gian
  const categorizeRequests = (requests: any[]) => {
    if (!requests || !Array.isArray(requests))
      return { upcoming: [], past: [] };

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to start of today for date comparison
    const upcoming: any[] = [];
    const past: any[] = [];

    requests.forEach((request) => {
      const requestDate = new Date(request.requested_date);
      requestDate.setHours(0, 0, 0, 0);

      if (requestDate >= now) {
        upcoming.push(request);
      } else {
        past.push(request);
      }
    });

    // Sắp xếp upcoming theo thời gian tăng dần, past theo thời gian giảm dần
    upcoming.sort(
      (a, b) =>
        new Date(a.requested_date).getTime() -
        new Date(b.requested_date).getTime()
    );
    past.sort(
      (a, b) =>
        new Date(b.requested_date).getTime() -
        new Date(a.requested_date).getTime()
    );

    return { upcoming, past };
  };

  const handleRequestAssignment = (booking: any) => {
    const bookingRequestId =
      booking.id || booking.booking_request_id || booking.request_id;

    if (!bookingRequestId) {
      alert("Không tìm thấy ID của booking request");
      console.error("Booking object:", booking);
      return;
    }

    // console.log("Sending request with:", {
    //   booking_request_id: bookingRequestId,
    //   doctor_id: info?.id,
    //   notes: notes,
    // });

    dispatch(
      requestDoctorAssignment({
        booking_request_id: bookingRequestId,
        doctor_id: info?.id,
        notes: notes,
      })
    ).then(() => {
      // Reset form after successful request
      setSelectedBooking(null);
      setNotes("");
      // Refresh the list
      handleSearch();
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "assigned":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "assigned":
        return "Đã phân công";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "assigned":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Render booking card
  const renderBookingCard = (booking: any, index: string) => {
    return (
      <div
        key={index}
        className={`bg-gradient-to-r from-white to-gray-50 border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 ${
          booking.status === "pending"
            ? "border-yellow-200 hover:border-yellow-300"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {/* Booking Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-gray-800">
                  {formatDate(booking.requested_date)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-700">
                  {booking.requested_time_slot}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Package className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-600">
                <strong>Gói khám:</strong> {booking.package?.name}
              </span>
            </div>
          </div>

          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center space-x-2 ${getStatusColor(
              booking.status
            )}`}
          >
            {getStatusIcon(booking.status)}
            <span>{getStatusText(booking.status)}</span>
          </div>
        </div>

        {/* Action Section */}
        {booking.status === "pending" && (
          <div className="border-t border-gray-100 pt-4">
            {selectedBooking === index ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">
                      Xác nhận nhận khám
                    </h4>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Nhập ghi chú cho yêu cầu này..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                      rows={3}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleRequestAssignment(booking)}
                      disabled={assignmentLoading}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        {assignmentLoading
                          ? "Đang gửi..."
                          : "Xác nhận nhận khám"}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedBooking(null);
                        setNotes("");
                      }}
                      className="flex-1 sm:flex-none bg-gray-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Hủy</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setSelectedBooking(index);
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Nhận khám gói này</span>
              </button>
            )}
          </div>
        )}

        {booking.status !== "pending" && (
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center space-x-2 text-gray-500">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm italic">Gói khám này đã được xử lý</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading && !bookingRequests) {
    return (
      <div className="flex items-center justify-center min-h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-blue-600 font-medium">
            Đang tải danh sách yêu cầu...
          </p>
        </div>
      </div>
    );
  }

  const { upcoming, past } = categorizeRequests(bookingRequests);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Yêu cầu khám bệnh</h1>
            <p className="text-blue-100 mt-1">
              Quản lý và nhận yêu cầu khám bệnh từ bệnh nhân
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Search Filters */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Bộ lọc tìm kiếm
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Ngày khám
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tên gói khám
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nhập tên gói khám"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? "Đang tìm..." : "Tìm kiếm"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        {bookingRequests && bookingRequests.length > 0 && (
          <div className="border-b border-gray-200 mb-8">
            <div className="flex w-full">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "upcoming"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Yêu cầu sắp tới</span>
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
                <span>Yêu cầu đã qua</span>
                <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {past.length}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {!bookingRequests || bookingRequests.length === 0 ? (
          !loading && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Stethoscope className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Không có yêu cầu khám nào
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Hiện tại không có yêu cầu khám nào phù hợp với bộ lọc của bạn.
                Thử thay đổi bộ lọc tìm kiếm để xem thêm kết quả.
              </p>
            </div>
          )
        ) : (
          <div className="space-y-4">
            {/* Hiển thị yêu cầu theo tab active */}
            {activeTab === "upcoming" && upcoming.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Có {upcoming.length} yêu cầu sắp tới
                  </h3>
                  <div className="text-sm text-gray-500">
                    Tìm thấy{" "}
                    {upcoming.filter((b) => b.status === "pending").length} yêu
                    cầu chờ xử lý
                  </div>
                </div>
                {upcoming.map((booking, index) =>
                  renderBookingCard(booking, `upcoming-${index}`)
                )}
              </>
            )}

            {activeTab === "past" && past.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Có {past.length} yêu cầu đã qua
                  </h3>
                  <div className="text-sm text-gray-500">
                    Đã xử lý {past.filter((b) => b.status !== "pending").length}{" "}
                    yêu cầu
                  </div>
                </div>
                {past.map((booking, index) =>
                  renderBookingCard(booking, `past-${index}`)
                )}
              </>
            )}

            {/* Hiển thị message khi không có yêu cầu trong tab hiện tại */}
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
                    ? "Chưa có yêu cầu sắp tới"
                    : "Chưa có yêu cầu đã qua"}
                </h3>
                <p className="text-gray-500">
                  {activeTab === "upcoming"
                    ? "Hiện tại bạn chưa có yêu cầu khám nào sắp tới."
                    : "Bạn chưa có yêu cầu khám nào đã qua."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
