import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSchedule } from "../../../../../redux/scheduleSlice";
import {
  X,
  Calendar,
  Clock,
  Stethoscope,
  Plus,
  AlertCircle,
  CheckCircle,
  Settings,
} from "lucide-react";
import { AppDispatch, RootState } from "../../../../../redux/store";

export const CreateSchedule = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const dispatch:AppDispatch = useDispatch();
  const { isCreating, createError } = useSelector((state: RootState) => state.schedules);

  const [formData, setFormData] = useState<{date: string; start_time: string; end_time: string; type: "specialist" | "specialist_online"; service_id: string; status?: "available" | "booked"; }>({
    date: "",
    start_time: "",
    end_time: "",
    type: "specialist",
    service_id: "",
    status: "available",
  });

  const [errors, setErrors] = useState<any>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const serviceOptions = [
    { id: 101, name: "Cơ xương khớp", type: "specialist" },
    { id: 102, name: "Thần kinh", type: "specialist" },
    { id: 103, name: "Tiêu hoá", type: "specialist" },
    { id: 104, name: "Tim mạch", type: "specialist" },
    { id: 105, name: "Da liễu", type: "specialist" },
    { id: 106, name: "Sức khoẻ tâm thần", type: "specialist" },
    { id: 107, name: "Cơ xương khớp từ xa", type: "specialist_online" },
    { id: 108, name: "Thần kinh từ xa", type: "specialist_online" },
    { id: 109, name: "Tiêu hoá từ xa", type: "specialist_online" },
    { id: 110, name: "Tim mạch từ xa", type: "specialist_online" },
    { id: 111, name: "Da liễu từ xa", type: "specialist_online" },
    { id: 112, name: "Sức khoẻ tâm thần từ xa", type: "specialist_online" },
    {
      id: 113,
      name: "Tư vấn trị liệu tâm lý từ xa",
      type: "specialist_online",
    },
  ];

  // Lọc services theo type đã chọn
  const filteredServices = serviceOptions.filter(
    (service) => service.type === formData.type
  );

  // Reset form khi đóng modal
  const handleClose = () => {
    setFormData({
      date: "",
      start_time: "",
      end_time: "",
      type: "specialist",
      service_id: "",
      status: "available",
    });
    setErrors({});
    setShowSuccess(false);
    onClose();
  };

  // Validate form
  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.date) {
      newErrors.date = "Vui lòng chọn ngày";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "Không thể chọn ngày trong quá khứ";
      }
    }

    if (!formData.start_time) {
      newErrors.start_time = "Vui lòng chọn giờ bắt đầu";
    }

    if (!formData.end_time) {
      newErrors.end_time = "Vui lòng chọn giờ kết thúc";
    }

    if (formData.start_time && formData.end_time) {
      if (formData.start_time >= formData.end_time) {
        newErrors.end_time = "Giờ kết thúc phải sau giờ bắt đầu";
      }
    }

    if (!formData.service_id) {
      newErrors.service_id = "Vui lòng chọn dịch vụ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Nếu thay đổi type, reset service_id
    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        [name]: value as "specialist" | "specialist_online",
        service_id: "", // Reset service khi đổi type
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error khi user nhập lại
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Convert service_id to number để match với API
      const submitData = {
        ...formData,
        service_id: parseInt(formData.service_id),
      };

      const resultAction = await dispatch(createSchedule(submitData));

      if (createSchedule.fulfilled.match(resultAction)) {
        setShowSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
    }
  };

  // Format date for input (today as minimum)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Thêm lịch mới</h2>
                <p className="text-blue-100 text-sm">Tạo lịch làm việc mới</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">Tạo lịch thành công!</p>
          </div>
        )}

        {/* Error Message */}
        {createError && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-medium">{createError}</p>
          </div>
        )}

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Date Input */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>Ngày làm việc</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              min={getMinDate()}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.date ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.date && (
              <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.date}</span>
              </p>
            )}
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 text-green-500" />
                <span>Giờ bắt đầu</span>
              </label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.start_time
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.start_time && (
                <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.start_time}</span>
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span>Giờ kết thúc</span>
              </label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.end_time
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.end_time && (
                <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.end_time}</span>
                </p>
              )}
            </div>
          </div>

          {/* Type Select */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Stethoscope className="w-4 h-4 text-purple-500" />
              <span>Loại khám</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            >
              <option value="specialist">Khám chuyên khoa</option>
              <option value="specialist_online">Khám chuyên khoa online</option>
            </select>
          </div>

          {/* Service Select - MỚI THÊM */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Settings className="w-4 h-4 text-orange-500" />
              <span>Dịch vụ cụ thể</span>
            </label>
            <select
              name="service_id"
              value={formData.service_id}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white ${
                errors.service_id
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
            >
              <option value="">Chọn dịch vụ...</option>
              {filteredServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            {errors.service_id && (
              <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.service_id}</span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
              disabled={isCreating}
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isCreating}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Tạo lịch</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
