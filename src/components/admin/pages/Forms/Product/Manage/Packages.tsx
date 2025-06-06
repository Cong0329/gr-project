import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../../../redux/store";
import {
  getPendingDoctorAssignments,
  approveDoctorAndCreateSchedule,
} from "../../../../../../redux/doctorAssignmentSlice";

const DoctorAssignmentPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { pendingAssignments, status, error } = useSelector(
    (state: RootState) => state.doctorAssignment
  );

  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [showPatientInfo, setShowPatientInfo] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getPendingDoctorAssignments());
  }, [dispatch]);

  const handleApprove = async (bookingRequestId: number, doctorId: string) => {
    try {
      await dispatch(
        approveDoctorAndCreateSchedule({
          booking_request_id: bookingRequestId,
          doctor_id: doctorId,
        })
      ).unwrap();

      // Refresh danh sách sau khi approve
      dispatch(getPendingDoctorAssignments());
    } catch (error) {
      console.error("Error approving doctor:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Không cần parse vì patient_info đã là object rồi
  const getPatientInfo = (patientInfo: any) => {
    return patientInfo || null;
  };

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý yêu cầu phân công bác sĩ
          </h1>
          <p className="text-gray-600 mt-2">
            Danh sách các yêu cầu phân công bác sĩ đang chờ phê duyệt
          </p>
        </div>

        {pendingAssignments?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              Không có yêu cầu phân công nào đang chờ duyệt
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingAssignments?.map((assignment: any) => {
              // Lấy thông tin bệnh nhân trực tiếp - đã là object rồi
              const patientInfo = getPatientInfo(
                assignment.bookingRequest?.patient_info
              );

              return (
                <div
                  key={assignment.id}
                  className="bg-white rounded-lg shadow-md border"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                          Chờ duyệt
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          Yêu cầu #{assignment.id} •{" "}
                          {new Date(assignment.created_at).toLocaleString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Thông tin bác sĩ */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">
                          👨‍⚕️ Thông tin bác sĩ
                        </h3>
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium">Tên:</span>{" "}
                            {assignment.doctor?.name}
                          </p>
                          <p>
                            <span className="font-medium">Loại:</span>{" "}
                            {assignment.doctor?.type}
                          </p>
                          <p>
                            <span className="font-medium">Kinh nghiệm:</span>{" "}
                            {assignment.doctor?.experience} năm
                          </p>
                        </div>
                      </div>

                      {/* Thông tin booking */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">
                          📋 Thông tin đặt lịch
                        </h3>
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium">Gói khám:</span>{" "}
                            {assignment.bookingRequest?.package?.name}
                          </p>
                          <p>
                            <span className="font-medium">Giá:</span>{" "}
                            {assignment.bookingRequest?.package?.price?.toLocaleString(
                              "vi-VN"
                            )}{" "}
                            VNĐ
                          </p>
                          <p>
                            <span className="font-medium">Ngày khám:</span>{" "}
                            {formatDate(
                              assignment.bookingRequest?.requested_date
                            )}
                          </p>
                          <p>
                            <span className="font-medium">Thời gian:</span>{" "}
                            {assignment.bookingRequest?.requested_time_slot}
                          </p>
                          {assignment.bookingRequest?.notes && (
                            <p>
                              <span className="font-medium">Ghi chú:</span>{" "}
                              {assignment.bookingRequest.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Thông tin bệnh nhân */}
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-lg text-gray-800">
                          👤 Thông tin bệnh nhân
                        </h3>
                        <button
                          onClick={() =>
                            setShowPatientInfo(
                              showPatientInfo === assignment.id
                                ? null
                                : assignment.id
                            )
                          }
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                        >
                          {showPatientInfo === assignment.id
                            ? "Ẩn"
                            : "Xem chi tiết"}
                        </button>
                      </div>

                      {showPatientInfo === assignment.id && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          {patientInfo ? (
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <p>
                                  <span className="font-medium">Họ tên:</span>{" "}
                                  {patientInfo.name ||
                                    patientInfo.fullName ||
                                    "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">
                                    Ngày sinh:
                                  </span>{" "}
                                  {patientInfo.dob ||
                                    patientInfo.dateOfBirth ||
                                    "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">
                                    Giới tính:
                                  </span>{" "}
                                  {patientInfo.gender || "N/A"}
                                </p>
                                {patientInfo.age && (
                                  <p>
                                    <span className="font-medium">Tuổi:</span>{" "}
                                    {patientInfo.age}
                                  </p>
                                )}
                              </div>
                              <div>
                                <p>
                                  <span className="font-medium">SĐT:</span>{" "}
                                  {patientInfo.phone ||
                                    patientInfo.phoneNumber ||
                                    "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">Email:</span>{" "}
                                  {patientInfo.email || "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">Địa chỉ:</span>{" "}
                                  {patientInfo.address || "N/A"}
                                </p>
                                {patientInfo.identityCard && (
                                  <p>
                                    <span className="font-medium">CCCD:</span>{" "}
                                    {patientInfo.identityCard}
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-gray-500">
                                Chưa có thông tin bệnh nhân
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-4 border-t flex justify-end space-x-3">
                      <button
                        onClick={() =>
                          handleApprove(
                            assignment.bookingRequest.id,
                            assignment.doctor.id
                          )
                        }
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                      >
                        ✅ Phê duyệt & Tạo lịch
                      </button>
                      <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
                        ❌ Từ chối
                      </button>
                    </div>

                    {assignment.notes && (
                      <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                        <p className="text-sm">
                          <span className="font-medium">
                            Ghi chú từ bác sĩ:
                          </span>{" "}
                          {assignment.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {status === "loading" && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white text-sm">Đang tải...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorAssignmentPage;
