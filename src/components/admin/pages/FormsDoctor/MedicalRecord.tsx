import  { useState, useEffect } from "react";
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
import { AppDispatch } from "../../../../redux/store";

const MedicalRecord = () => {
  const dispatch:AppDispatch = useDispatch();

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
  });

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
      });
      dispatch(resetCreateState());
      // Refresh danh sách
      dispatch(getDoctorMedicalRecords());
    }
  }, [createSuccess, dispatch]);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Medical Record Test
      </h1>

      {/* Create Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Tạo Hồ Sơ Bệnh Án
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID (UUID)
              </label>
              <input
                type="text"
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                placeholder="Nhập user ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule ID
              </label>
              <input
                type="number"
                name="schedule_id"
                value={formData.schedule_id}
                onChange={handleInputChange}
                placeholder="Nhập schedule ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chẩn Đoán
            </label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
              placeholder="Nhập chẩn đoán"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Điều Trị
            </label>
            <textarea
              name="treatment"
              value={formData.treatment}
              onChange={handleInputChange}
              placeholder="Nhập phương pháp điều trị"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {createError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {createError}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={createLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createLoading ? "Đang tạo..." : "Tạo Hồ Sơ"}
          </button>
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Danh Sách Hồ Sơ Bệnh Án ({records.length})
          </h2>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Đang tải..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Đang tải dữ liệu...</div>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Chưa có hồ sơ bệnh án nào</div>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record: any) => (
              <div
                key={record.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Hồ sơ #{record.id}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">User ID:</span>{" "}
                        {record.user_id}
                      </p>
                      <p>
                        <span className="font-medium">Schedule ID:</span>{" "}
                        {record.schedule_id}
                      </p>
                      <p>
                        <span className="font-medium">Ngày tạo:</span>{" "}
                        {new Date(record.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>

                    {/* User Info */}
                    {record.mr_user && (
                      <div className="mt-3 p-2 bg-blue-50 rounded">
                        <p className="text-sm font-medium text-blue-800">
                          Thông tin bệnh nhân:
                        </p>
                        <p className="text-sm text-blue-700">
                          {record.mr_user.name} - {record.mr_user.phone}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-700 mb-1">
                        Chẩn đoán:
                      </h4>
                      <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                        {record.diagnosis}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">
                        Điều trị:
                      </h4>
                      <p className="text-sm text-gray-600 bg-green-50 p-2 rounded">
                        {record.treatment}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecord;
