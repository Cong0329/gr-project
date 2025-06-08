import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDoctorMedicalRecords,
  createMedicalRecord,
  resetCreateState,
  selectMedicalRecords,
  selectMedicalRecordLoading,
  selectMedicalRecordError,
  selectCreateLoading,
  selectCreateError,
  selectCreateSuccess,
} from "../../../../redux/medicalRecordSlice";
import { useLocation } from "react-router-dom";
import {
  FileText,
  User,
  Calendar,
  Plus,
  RefreshCw,
  Stethoscope,
  Clipboard,
} from "lucide-react";
import { AppDispatch } from "../../../../redux/store";

const MedicalRecord = () => {
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();

  const navigateData = location.state || {};
  // const { patient, patientId, scheduleId, appointmentData, scheduleData } =
  //   navigateData;
  const { patient, patientId, scheduleId, scheduleData } = navigateData;
  // Selectors
  const records = useSelector(selectMedicalRecords);
  const loading = useSelector(selectMedicalRecordLoading);
  const error = useSelector(selectMedicalRecordError);
  const createLoading = useSelector(selectCreateLoading);
  const createError = useSelector(selectCreateError);
  const createSuccess = useSelector(selectCreateSuccess);

  // Form state
  const [formData, setFormData] = useState({
    user_id: "",
    schedule_id: "",
    diagnosis: "",
    treatment: "",
    patientName: "",
    patientPhone: "",
    patientEmail: "",
  });

  useEffect(() => {
    if (patientId && scheduleId) {
      setFormData((prev) => ({
        ...prev,
        user_id: patientId,
        schedule_id: scheduleId.toString(),
        patientName: patient?.name,
        patientPhone: patient?.phone,
        patientEmail: patient?.email,
      }));
    }
  }, [patientId, scheduleId, patient]);

  // Load records on component mount
  useEffect(() => {
    dispatch(getDoctorMedicalRecords());
  }, [dispatch]);

  // Handle create success
  useEffect(() => {
    if (createSuccess) {
      alert("Tạo hồ sơ bệnh án thành công!");
      setFormData({
        user_id: "",
        schedule_id: "",
        diagnosis: "",
        treatment: "",
        patientName: "",
        patientPhone: "",
        patientEmail: "",
      });
      dispatch(resetCreateState());
      // Refresh danh sách
      dispatch(getDoctorMedicalRecords());
    }
  }, [createSuccess, dispatch]);

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = () => {
    // Validate form
    if (
      !formData.user_id ||
      !formData.schedule_id ||
      !formData.diagnosis ||
      !formData.treatment
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Convert schedule_id to number
    const submitData = {
      ...formData,
      schedule_id: parseInt(formData.schedule_id),
    };

    dispatch(createMedicalRecord(submitData));
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(getDoctorMedicalRecords());
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Hồ Sơ Bệnh Án</h1>
                <p className="text-blue-100 mt-1">
                  Quản lý hồ sơ khám bệnh và điều trị
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-colors duration-200 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
              <span className="font-medium">
                {loading ? "Đang tải..." : "Làm mới"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Create Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Tạo Hồ Sơ Bệnh Án Mới
            </h2>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <input type="hidden" name="user_id" value={formData.user_id} />
          <input
            type="hidden"
            name="schedule_id"
            value={formData.schedule_id}
          />

          {/* Patient Info */}
          {formData.patientName && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-blue-800">
                  Thông tin bệnh nhân
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-500">
                    Tên bệnh nhân
                  </span>
                  <p className="font-semibold text-gray-800">
                    {formData.patientName}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-500">
                    Điện thoại
                  </span>
                  <p className="font-semibold text-gray-800">
                    {formData.patientPhone}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-500">
                    Email
                  </span>
                  <p className="font-semibold text-gray-800">
                    {formData.patientEmail}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Info */}
          {scheduleData && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-green-800">
                  Thông tin lịch khám
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-500">
                    Ngày khám
                  </span>
                  <p className="font-semibold text-gray-800">
                    {new Date(scheduleData.date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-500">
                    Thời gian
                  </span>
                  <p className="font-semibold text-gray-800">
                    {scheduleData.start_time?.slice(0, 5)} -{" "}
                    {scheduleData.end_time?.slice(0, 5)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Manual Input Warning */}
          {!formData.user_id && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                  <Clipboard className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-amber-800">
                  Nhập thông tin thủ công
                </h3>
              </div>
              <p className="text-amber-700 text-sm mb-4">
                Chưa có thông tin bệnh nhân từ lịch khám. Vui lòng nhập thông
                tin thủ công:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    User ID (UUID) *
                  </label>
                  <input
                    type="text"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleInputChange}
                    placeholder="Nhập user ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Schedule ID *
                  </label>
                  <input
                    type="number"
                    name="schedule_id"
                    value={formData.schedule_id}
                    onChange={handleInputChange}
                    placeholder="Nhập schedule ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <Stethoscope className="w-4 h-4" />
                <span>Chẩn Đoán *</span>
              </label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                placeholder="Nhập chẩn đoán chi tiết..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <Clipboard className="w-4 h-4" />
                <span>Điều Trị *</span>
              </label>
              <textarea
                name="treatment"
                value={formData.treatment}
                onChange={handleInputChange}
                placeholder="Nhập phương pháp điều trị..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
          </div>

          {/* Error Message */}
          {createError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm font-medium">{createError}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={createLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            {createLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Đang tạo hồ sơ...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Tạo Hồ Sơ Bệnh Án</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Danh Sách Hồ Sơ Bệnh Án
                </h2>
                <p className="text-purple-100 text-sm">
                  Tổng cộng: {records.length} hồ sơ
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                <p className="text-blue-600 font-medium">
                  Đang tải dữ liệu hồ sơ...
                </p>
              </div>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Chưa có hồ sơ bệnh án
              </h3>
              <p className="text-gray-500">
                Hiện tại chưa có hồ sơ bệnh án nào được tạo.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 bg-gradient-to-r from-white to-gray-50"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">
                          Hồ sơ #{record.id}
                        </h3>
                      </div>

                      <div className="bg-white rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">
                            User ID:
                          </span>
                          <span className="text-sm text-gray-800 font-mono">
                            {record.user_id}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">
                            Schedule ID:
                          </span>
                          <span className="text-sm text-gray-800">
                            {record.schedule_id}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">
                            Ngày tạo:
                          </span>
                          <span className="text-sm text-gray-800">
                            {new Date(record.createdAt).toLocaleString("vi-VN")}
                          </span>
                        </div>
                      </div>

                      {/* Patient Info */}
                      {record.mr_user && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="w-4 h-4 text-blue-600" />
                            <p className="text-sm font-semibold text-blue-800">
                              Thông tin bệnh nhân
                            </p>
                          </div>
                          <p className="text-sm text-blue-700 font-medium">
                            {record.mr_user.name}
                            {record.mr_user.phone
                              ? ` - ${record.mr_user.phone}`
                              : record.user_id === formData.user_id &&
                                formData.patientPhone
                              ? ` - ${formData.patientPhone}`
                              : " - Chưa có SĐT"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Stethoscope className="w-4 h-4 text-yellow-600" />
                          <h4 className="font-semibold text-gray-700">
                            Chẩn đoán
                          </h4>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {record.diagnosis}
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Clipboard className="w-4 h-4 text-green-600" />
                          <h4 className="font-semibold text-gray-700">
                            Phương pháp điều trị
                          </h4>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {record.treatment}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecord;
