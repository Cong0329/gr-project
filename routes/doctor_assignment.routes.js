const express = require('express');
const router = express.Router();
const doctorAssignmentController = require('../controllers/doctor_assignment.controller');

// Route để tạo yêu cầu bác sĩ cho một booking request
// Chỉ admin và staff mới có thể tạo yêu cầu
router.post(
  '/request',
  doctorAssignmentController.requestDoctorAssignment
);

// Route để cập nhật trạng thái yêu cầu bác sĩ (approve/reject)
// Bác sĩ, admin, staff có thể thực hiện
router.put(
  '/:id',
  doctorAssignmentController.updateDoctorAssignment
);

// Route để lấy danh sách yêu cầu bác sĩ theo booking request
// Admin, staff có thể xem
router.get(
  '/booking-request/:booking_request_id',
  doctorAssignmentController.getAssignmentsByBookingRequest
);

// Route để lấy danh sách yêu cầu bác sĩ theo doctor
// Bác sĩ có thể xem yêu cầu của mình, admin/staff có thể xem tất cả
router.get(
  '/doctor/:doctor_id',
  doctorAssignmentController.getAssignmentsByDoctor
);

// Route để lấy chi tiết yêu cầu bác sĩ
// Bác sĩ có thể xem yêu cầu của mình, admin/staff có thể xem tất cả
router.get(
  '/:id',
  doctorAssignmentController.getAssignmentById
);


// Lấy chi tiết booking kèm thông tin doctor assignments
router.get('/:id/with-assignments', doctorAssignmentController.getBookingRequestWithAssignments);

// Phê duyệt bác sĩ được chỉ định cho booking request và khởi tạo lịch
router.post('/approve-doctor', doctorAssignmentController.approveDoctorAndCreateSchedule);

module.exports = router;