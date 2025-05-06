import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmAppointment,
  createAppointment,
} from "../../redux/appointmentSlice";
import { toast, Toaster } from "react-hot-toast"; // Thêm Toaster provider
import axios from "axios";
import SuccessAnimation from "../../components/home_booking/details/component_details/AnimationBooked";

// Component LoadingSpinner
const LoadingSpinner = ({ size = "medium" }) => {
  const sizeClass = size === "small" ? "h-4 w-4" : "h-8 w-8";
  return (
    <div className="flex justify-center">
      <div
        className={`${sizeClass} border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin`}
      ></div>
    </div>
  );
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { packageInfo } = location.state || {};

  const [showSuccess, setShowSuccess] = useState(false);

  const dispatch = useDispatch();

  // Đảm bảo state.appointments tồn tại trước khi truy cập
  const appointmentsState = useSelector((state) => state.appointments || {});
  const isConfirming = appointmentsState?.creating || false;

  // Debug Redux state
  useEffect(() => {
    console.log("Redux state:", appointmentsState);
  }, [appointmentsState]);

  // Kiểm tra rõ ràng trước khi truy cập thuộc tính appointments
  // Lấy current appointment từ state hoặc từ location nếu có
  const currentAppointment = useMemo(() => {
    // Nếu có trong location.state, ưu tiên dùng
    if (location.state?.appointment?.id) {
      return location.state.appointment;
    }

    // Nếu không có trong location, tìm trong redux store
    if (!appointmentsState?.appointments?.length) return null;

    return appointmentsState.appointments[
      appointmentsState.appointments.length - 1
    ];
  }, [appointmentsState, location.state]);

  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    birthDate: "",
    reason: "",
    paymentMethod: "vnpay",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error khi người dùng nhập
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!userInfo.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên";
    }

    if (!userInfo.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!userInfo.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(userInfo.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!userInfo.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý thanh toán VNPay
  const processVNPayPayment = async () => {
    if (!currentAppointment?.id) {
      toast.error("Thông tin đặt lịch không hợp lệ");
      return false;
    }

    try {
      // Log cho debug
      console.log("Đang gửi yêu cầu thanh toán VNPay với dữ liệu:", {
        appointmentId: currentAppointment.id,
        amount: packageInfo?.price || 0,
        userInfo: userInfo,
      });

      // Gửi request tạo URL thanh toán VNPay
      const response = await axios.post("/api/payment/vnpay/create", {
        appointmentId: currentAppointment.id,
        amount: packageInfo?.price || 0,
        userInfo: userInfo,
      });

      // Nếu thành công, chuyển hướng đến trang thanh toán VNPay
      if (response.data && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
        return true;
      } else {
        console.error("VNPay response:", response.data);
        toast.error("Không nhận được URL thanh toán");
        return false;
      }
    } catch (error) {
      console.error("VNPay error:", error);
      toast.error("Có lỗi xảy ra khi khởi tạo thanh toán qua VNPay");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsSubmitting(true);
    let newAppointmentId = null;
    let appointmentData = null;

    try {
      const userId = "2d46df95-1a24-407a-a9be-65e7343ddb72";
      const packageInfo = location.state?.packageInfo || {};

      // Đảm bảo service_id là số nguyên (INTEGER) như trong model
      let service_id = packageInfo.service_id;
      if (!service_id) {
        if (
          packageInfo.type === "specialist" ||
          packageInfo.type === "specialist_online"
        ) {
          service_id = packageInfo.department?.id;
        } else {
          service_id =
            packageInfo.doctor?.service_package_id ||
            packageInfo.department?.id;
        }
      }

      // Ép kiểu service_id về số nguyên
      service_id = parseInt(service_id);
      if (isNaN(service_id)) {
        toast.error("Lỗi: service_id không hợp lệ");
        setIsSubmitting(false);
        return;
      }

      // Đảm bảo schedule_id là số nguyên (INTEGER)
      const schedule_id = parseInt(packageInfo.scheduleId);
      if (isNaN(schedule_id)) {
        toast.error("Lỗi: schedule_id không hợp lệ");
        setIsSubmitting(false);
        return;
      }

      // Định dạng thời gian để phù hợp với định dạng TIME trong database
      let start_time = packageInfo.time
        ? packageInfo.time.split(" - ")[0].trim()
        : "";
      let end_time = packageInfo.time
        ? packageInfo.time.split(" - ")[1].trim()
        : "";

      // Đảm bảo start_time và end_time có định dạng đúng HH:MM:SS
      if (start_time && !start_time.includes(":")) {
        start_time = start_time + ":00";
      } else if (start_time && start_time.split(":").length === 2) {
        start_time = start_time + ":00";
      }

      if (end_time && !end_time.includes(":")) {
        end_time = end_time + ":00";
      } else if (end_time && end_time.split(":").length === 2) {
        end_time = end_time + ":00";
      }

      // Thêm trường status vào appointmentData
      appointmentData = {
        user_id: userId,
        doctor_id:
          packageInfo.doctor?.id || "0961976a-ac57-49d7-8db1-af9272058159",
        schedule_id: schedule_id,
        date: packageInfo.date,
        start_time: start_time,
        end_time: end_time,
        type: packageInfo.type,
        service_id: service_id,
        payment_method: userInfo.paymentMethod === "vnpay" ? "online" : "cash",
        amount: parseFloat(packageInfo.price) || 500000,
        // Thêm status tại đây
        status:
          userInfo.paymentMethod === "vnpay" ? "pending_payment" : "confirmed",
        // Thêm payment_status cho thanh toán tiền mặt
        payment_status:
          userInfo.paymentMethod === "vnpay" ? "pending" : "confirmed",
        // Thêm thông tin bệnh nhân từ form
        patient_info: {
          name: userInfo.fullName,
          phone: userInfo.phone,
          email: userInfo.email,
          dob: userInfo.dob,
          gender: userInfo.gender,
          address: userInfo.address,
        },
      };

      // Log chi tiết về dữ liệu trước khi gửi
      console.log(
        "Appointment data being sent (formatted):",
        JSON.stringify(appointmentData, null, 2)
      );

      const createResult = await dispatch(
        createAppointment(appointmentData)
      ).unwrap();

      console.log("Created appointment result:", createResult);

      if (!createResult || !createResult.id) {
        throw new Error("Không thể tạo lịch khám. Vui lòng thử lại sau.");
      }

      newAppointmentId = createResult.id;

      if (userInfo.paymentMethod === "vnpay") {
        await processVNPayPayment(newAppointmentId);
      } else {
        setShowSuccess(true); // hiển thị animation trong JSX return

        setTimeout(() => {
          navigate("/appointment-success", {
            state: {
              appointment: {
                ...createResult,
                status: "confirmed",
                payment_status: "confirmed",
              },
            },
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Payment process error:", error);

      // Thêm xử lý lỗi đặc biệt cho 404
      if (error.response?.status === 404) {
        toast.error("Không tìm thấy API endpoint xác nhận. Kiểm tra URL API.");
      } else {
        toast.error(error.message || "Có lỗi xảy ra khi xử lý thanh toán");
      }

      // Mặc dù xác nhận thất bại nhưng lịch hẹn đã được tạo,
      // có thể chuyển hướng người dùng với thông tin đã có
      if (newAppointmentId && appointmentData) {
        toast.warning(
          "Lịch hẹn đã được tạo nhưng chưa được xác nhận đầy đủ. Vui lòng liên hệ hỗ trợ."
        );
        navigate("/appointment-success", {
          state: {
            appointment: {
              id: newAppointmentId,
              status: appointmentData.status,
              payment_status: appointmentData.payment_status,
              date: appointmentData.date,
              start_time: appointmentData.start_time,
              end_time: appointmentData.end_time,
              doctor_id: appointmentData.doctor_id,
              patient_info: appointmentData.patient_info,
            },
          },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Kiểm tra các dependencies cần thiết khi component mount
  useEffect(() => {
    // Kiểm tra packageInfo
    if (!packageInfo) {
      toast.error("Không tìm thấy thông tin gói khám");
      navigate("/packages");
      return;
    }

    // Kiểm tra currentAppointment sau khi component mount
    if (!currentAppointment?.id) {
      console.warn("Không tìm thấy thông tin lịch khám hiện tại");
    }
  }, [packageInfo, currentAppointment, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">ĐẶT LỊCH KHÁM</h1>
          <p className="mt-2 text-gray-600">
            Quý khách vui lòng điền đầy đủ thông tin để tiết kiệm thời gian làm
            thủ tục khám
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b">
                Thông tin cá nhân
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={userInfo.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    required
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Ghi rõ họ và tên, viết hoa những chữ cái đầu tiên
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userInfo.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={userInfo.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                      required
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={userInfo.gender}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${
                        errors.gender ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                      required
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.gender}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={userInfo.birthDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lý do khám
                  </label>
                  <textarea
                    name="reason"
                    value={userInfo.reason}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mô tả triệu chứng hoặc lý do khám (nếu có)"
                  />
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Hình thức thanh toán
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="vnpay"
                        name="paymentMethod"
                        type="radio"
                        value="vnpay"
                        checked={userInfo.paymentMethod === "vnpay"}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="vnpay"
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        Thanh toán qua VnPay
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="cod"
                        name="paymentMethod"
                        type="radio"
                        value="cod"
                        checked={userInfo.paymentMethod === "cod"}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="cod"
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        Thanh toán sau tại cơ sở y tế
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        LƯU Ý
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Thông tin anh/chị cung cấp sẽ được sử dụng làm hồ sơ
                          khám bệnh. Khi điền thông tin anh/chị vui lòng:
                        </p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>
                            Ghi rõ họ và tên, viết hoa những chữ cái đầu tiên
                          </li>
                          <li>
                            Điền đầy đủ, đúng và kiểm tra lại thông tin trước
                            khi xác nhận
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || isConfirming}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium text-lg mt-6 transition duration-200"
                >
                  {isSubmitting || isConfirming ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    "Xác nhận thanh toán"
                  )}
                </button>
              </form>
            </div>

            {/* Thanh toán */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b">
                  Thông tin thanh toán
                </h2>

                {packageInfo ? (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Gói khám
                      </h3>
                      <p className="text-gray-600">{packageInfo.name}</p>
                    </div>

                    {/* Hiển thị thông tin ngày và giờ khám */}
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Thời gian khám
                      </h3>
                      <div className="bg-white p-3 rounded-md border border-gray-200">
                        <div className="flex items-center text-sm mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-blue-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="font-medium">Ngày: </span>
                          <span className="ml-1 text-gray-600">
                            {packageInfo.formattedDate}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-blue-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="font-medium">Giờ: </span>
                          <span className="ml-1 text-gray-600">
                            {packageInfo.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Chi tiết bác sĩ */}
                    {packageInfo.doctor && (
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-900 mb-2">
                          Bác sĩ
                        </h3>
                        <div className="flex items-center">
                          {packageInfo.doctor.avatar && (
                            <img
                              src={packageInfo.doctor.avatar}
                              alt={packageInfo.doctor.name}
                              className="w-10 h-10 rounded-full object-cover mr-3"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-800">
                              {packageInfo.doctor.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {packageInfo.doctor.position}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4 mt-6 pt-4 border-t">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Giá khám:</span>
                        <span className="font-medium">
                          {packageInfo?.price
                            ? `${packageInfo.price.toLocaleString("vi-VN")}đ`
                            : "0đ"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Phí đặt lịch:</span>
                        <span className="font-medium text-green-600">
                          Miễn phí
                        </span>
                      </div>

                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Tổng cộng:</span>
                          <span className="text-blue-600">
                            {packageInfo?.price
                              ? `${packageInfo.price.toLocaleString("vi-VN")}đ`
                              : "0đ"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-500">
                    Không có thông tin gói khám
                  </div>
                )}

                <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">
                    Thông tin liên hệ
                  </h3>
                  <p className="text-sm text-gray-600">
                    Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ:
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Hotline: <span className="font-medium">1900 1234</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Email:{" "}
                    <span className="font-medium">support@medical.com</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
          <SuccessAnimation />
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
