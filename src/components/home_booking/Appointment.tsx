import { useState } from "react";
import { useLocation } from "react-router-dom";

const AppointmentPage = () => {
  const location = useLocation();
  const { packageInfo } = location.state || {};

  // Thông tin user (nếu đã đăng nhập)
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    birthDate: "",
    reason: "",
    paymentMethod: "vnpay", // vnpay | cod
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý submit form ở đây
    console.log("Form submitted:", userInfo);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
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
            {/* Form thông tin */}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    required
                  />
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium text-lg mt-6 transition duration-200"
                >
                  XÁC NHẬN ĐẶT LỊCH
                </button>
              </form>
            </div>

            {/* Thanh toán */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b">
                  Thông tin thanh toán
                </h2>

                {packageInfo && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Gói khám</h3>
                    <p className="text-gray-600">{packageInfo.name}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giá khám:</span>
                    <span className="font-medium">
                      {packageInfo?.price
                        ? `${packageInfo.price.toLocaleString("vi-VN")}đ`
                        : "500.000đ"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí đặt lịch:</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">
                        {packageInfo?.price
                          ? `${packageInfo.price.toLocaleString("vi-VN")}đ`
                          : "500.000đ"}
                      </span>
                    </div>
                  </div>
                </div>

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
    </div>
  );
};

export default AppointmentPage;
