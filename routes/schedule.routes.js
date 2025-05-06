// const express = require('express');
// const router = express.Router();
// const scheduleController = require('../controllers/schedule.controller');
// const authenticateToken = require('../middlewares/auth.middleware');
// const requireRole = require('../middlewares/role.middleware');
// const {
//   validateGetAllSchedules,
//   validateGetDoctorSchedules,
//   validateCreateSchedule,
//   validateUpdateSchedule,
//   validateCreateAppointment,
//   validateUpdateAppointmentStatus,
//   validateCreatePackageBookingRequest,
//   validateRequestAssignment,
//   validateApproveAssignment,
//   validateAssignDoctor,
//   checkDoctorOwnership
// } = require('../middlewares/schedule.middleware');

// /**
//  * PUBLIC ROUTES (Không yêu cầu xác thực)
//  */

// // Lấy tất cả lịch trình (có phân trang, lọc theo doctor/type/status)
// router.get('/', validateGetAllSchedules, scheduleController.getAllSchedules);

// // Lấy lịch trình bác sĩ chuyên khoa
// router.get('/specialist', scheduleController.getSpecialistSchedules);

// // Lấy lịch trình cho các gói dịch vụ (cả general và medical)
// router.get('/service-packages', scheduleController.getServicePackageSchedules);

// // Lấy tất cả lịch trình của một bác sĩ cụ thể
// router.get('/doctor/:doctorId', validateGetDoctorSchedules, scheduleController.getDoctorSchedules);

// // Lấy chi tiết lịch trình
// router.get('/:id', scheduleController.getScheduleById);

// /**
//  * ROUTES YÊU CẦU ĐĂNG NHẬP (bất kỳ role nào)
//  */

// // Đặt lịch khám thông thường - có thể dùng cho cả user đã đăng nhập và chưa đăng nhập
// router.post('/appointments', validateCreateAppointment, scheduleController.createAppointment);

// /**
//  * ROUTES YÊU CẦU ROLE_USER
//  */

// // Tạo yêu cầu đặt lịch khám Package - Dành cho USER
// router.post('/package-booking-requests', 
//   authenticateToken, 
//   requireRole('ROLE_USER'),
//   validateCreatePackageBookingRequest,
//   scheduleController.createPackageBookingRequest
// );

// /**
//  * ROUTES YÊU CẦU ROLE_DOCTOR HOẶC ROLE_ADMIN
//  */

// // Lấy danh sách yêu cầu đặt lịch gói dịch vụ
// router.get('/package-booking-requests',
//   authenticateToken,
//   requireRole(['ROLE_DOCTOR', 'ROLE_ADMIN']),
//   scheduleController.getPackageBookingRequests
// );

// // Bác sĩ đăng ký nhận yêu cầu khám gói dịch vụ
// router.post('/doctor-assignments',
//   authenticateToken,
//   requireRole('ROLE_DOCTOR'),
//   validateRequestAssignment,
//   scheduleController.requestAssignment
// );

// // Tạo lịch trình mới (ADMIN hoặc DOCTOR với điều kiện là lịch của chính họ)
// router.post('/', 
//   authenticateToken, 
//   requireRole(['ROLE_DOCTOR', 'ROLE_ADMIN']),
//   (req, res, next) => {
//     // Nếu là ADMIN thì bỏ qua kiểm tra ownership
//     if (req.user.roles.includes('ROLE_ADMIN')) return next();
    
//     // Nếu là DOCTOR thì kiểm tra ownership
//     checkDoctorOwnership(req, res, next);
//   },
//   validateCreateSchedule,
//   scheduleController.createSchedule
// );

// // Cập nhật lịch trình (ADMIN hoặc DOCTOR với điều kiện là lịch của chính họ)
// router.put('/:id', 
//   authenticateToken, 
//   requireRole(['ROLE_DOCTOR', 'ROLE_ADMIN']),
//   (req, res, next) => {
//     // Nếu là ADMIN thì bỏ qua kiểm tra ownership
//     if (req.user.roles.includes('ROLE_ADMIN')) return next();
    
//     // Nếu là DOCTOR thì kiểm tra ownership
//     checkDoctorOwnership(req, res, next);
//   },
//   validateUpdateSchedule,
//   scheduleController.updateSchedule
// );

// // Cập nhật trạng thái yêu cầu đặt lịch (ADMIN hoặc DOCTOR với lịch của chính họ)
// router.patch('/appointments/:id', 
//   authenticateToken, 
//   requireRole(['ROLE_DOCTOR', 'ROLE_ADMIN']),
//   validateUpdateAppointmentStatus,
//   scheduleController.updateAppointmentStatus
// );

// /**
//  * ROUTES YÊU CẦU ROLE_ADMIN
//  */

// // Xóa lịch trình (chỉ ADMIN)
// router.delete('/:id', 
//   authenticateToken, 
//   requireRole('ROLE_ADMIN'),
//   scheduleController.deleteSchedule
// );

// // Admin phê duyệt/từ chối đăng ký của bác sĩ
// router.patch('/doctor-assignments/:id',
//   authenticateToken,
//   requireRole('ROLE_ADMIN'),
//   validateApproveAssignment,
//   scheduleController.approveAssignment
// );

// // Admin chủ động phân công bác sĩ
// router.post('/assign-doctor',
//   authenticateToken,
//   requireRole('ROLE_ADMIN'),
//   validateAssignDoctor,
//   scheduleController.assignDoctor
// );

// module.exports = router;

const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');
const {
  validateServiceTypeAndId,
  validateCreateSchedule
  } = require('../middlewares/schedule.middleware');

  const { check, validationResult } = require('express-validator');

  const validateResults = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  };

/**
 * PUBLIC ROUTES (Không yêu cầu xác thực)
 */

// Lấy tất cả lịch trình (có phân trang, lọc theo doctor/type/status)
router.get('/',  scheduleController.getAllSchedules);

// Lấy lịch trình bác sĩ chuyên khoa
router.get('/specialist', scheduleController.getSpecialistSchedules);

// Lấy lịch trình cho các gói dịch vụ (cả general và medical)
router.get('/service-packages', scheduleController.getServicePackageSchedules);

// Lấy tất cả lịch trình của một bác sĩ cụ thể
router.get('/doctor/:doctorId',  scheduleController.getDoctorSchedules);

// Lấy chi tiết lịch trình
router.get('/:id', scheduleController.getScheduleById);

/**
 * ROUTES YÊU CẦU ROLE_USER
 */

// Tạo yêu cầu đặt lịch khám Package - Dành cho USER
router.post('/package-booking-requests', 
   
  
  scheduleController.createPackageBookingRequest
);

/**
 * ROUTES YÊU CẦU ROLE_DOCTOR HOẶC ROLE_ADMIN
 */

// Lấy danh sách yêu cầu đặt lịch gói dịch vụ
router.get('/package-booking-requests',
  
  
  scheduleController.getPackageBookingRequests
);

// Bác sĩ đăng ký nhận yêu cầu khám gói dịch vụ
router.post('/doctor-assignments',
  
  
  scheduleController.requestAssignment
);

// Tạo lịch trình mới (ADMIN hoặc DOCTOR với điều kiện là lịch của chính họ)
router.post(
  '/',
  validateCreateSchedule,
  validateResults,
  validateServiceTypeAndId,
  scheduleController.createSchedule
);

// Cập nhật lịch trình (ADMIN hoặc DOCTOR với điều kiện là lịch của chính họ)
router.put('/:id', 
   
  
  (req, res, next) => {
    // Nếu là ADMIN thì bỏ qua kiểm tra ownership
    if (req.user.roles.includes('ROLE_ADMIN')) return next();
    
    // Nếu là DOCTOR thì kiểm tra ownership
    checkDoctorOwnership(req, res, next);
  },
  scheduleController.updateSchedule
);


/**
 * ROUTES YÊU CẦU ROLE_ADMIN
 */

// Xóa lịch trình (chỉ ADMIN)
router.delete('/:id', 
  scheduleController.deleteSchedule
);

// Admin phê duyệt/từ chối đăng ký của bác sĩ
router.patch('/doctor-assignments/:id',
  
  
  scheduleController.approveAssignment
);

// Admin chủ động phân công bác sĩ
router.post('/assign-doctor',
  
  
  scheduleController.assignDoctor
);

module.exports = router;