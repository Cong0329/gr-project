const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');
const {authenticateToken} = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const {
  validateGetAllSchedules,
  validateGetDoctorSchedules,
  validateCreateSchedule,
  validateUpdateSchedule,
  validateCreateAppointment,
  validateUpdateAppointmentStatus,
  checkDoctorOwnership
} = require('../middlewares/schedule.middleware');

/**
 * PUBLIC ROUTES (Không yêu cầu xác thực)
 */

// Lấy tất cả lịch trình (có phân trang, lọc theo doctor/type/status)
router.get('/', validateGetAllSchedules, scheduleController.getAllSchedules);

// Lấy lịch trình bác sĩ chuyên khoa
router.get('/specialist', scheduleController.getSpecialistSchedules);

// Lấy lịch trình bác sĩ khám tổng quát
router.get('/general', scheduleController.getGeneralSchedules);

// Lấy lịch trình khám gói y tế
router.get('/medical', scheduleController.getMedicalSchedules);

// Lấy tất cả lịch trình của một bác sĩ cụ thể
router.get('/doctor/:doctorId', validateGetDoctorSchedules, scheduleController.getDoctorSchedules);

// Lấy chi tiết lịch trình
router.get('/:id', scheduleController.getScheduleById);

/**
 * ROUTES YÊU CẦU ĐĂNG NHẬP (bất kỳ role nào)
 */

// Đặt lịch khám - có thể dùng cho cả user đã đăng nhập và chưa đăng nhập
router.post('/appointments', validateCreateAppointment, scheduleController.createAppointment);

/**
 * ROUTES YÊU CẦU ROLE_DOCTOR HOẶC ROLE_ADMIN
 */

// Tạo lịch trình mới (ADMIN hoặc DOCTOR với điều kiện là lịch của chính họ)
router.post('/', 
  authenticateToken, 
  (req, res, next) => {
    // Nếu là tạo lịch mới, cho phép nếu là ADMIN hoặc DOCTOR (với lịch của chính họ)
    const roleCheck = requireRole('ROLE_DOCTOR');
    const adminCheck = requireRole('ROLE_ADMIN');
    
    // Nếu là ADMIN thì cho phép luôn
    adminCheck(req, res, (err) => {
      if (!err) return next(); // Là ADMIN
      
      // Không phải ADMIN, kiểm tra xem có phải DOCTOR không
      roleCheck(req, res, (err) => {
        if (!err) {
          // Là DOCTOR, kiểm tra xem có quyền với lịch này không
          checkDoctorOwnership(req, res, next);
        } else {
          return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
      });
    });
  },
  validateCreateSchedule,
  scheduleController.createSchedule
);

// Cập nhật lịch trình (ADMIN hoặc DOCTOR với điều kiện là lịch của chính họ)
router.put('/:id', 
  authenticateToken, 
  (req, res, next) => {
    // Kiểm tra quyền tương tự như tạo lịch
    const roleCheck = requireRole('ROLE_DOCTOR');
    const adminCheck = requireRole('ROLE_ADMIN');
    
    adminCheck(req, res, (err) => {
      if (!err) return next();
      
      roleCheck(req, res, (err) => {
        if (!err) {
          checkDoctorOwnership(req, res, next);
        } else {
          return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
      });
    });
  },
  validateUpdateSchedule,
  scheduleController.updateSchedule
);

/**
 * ROUTES YÊU CẦU ROLE_ADMIN
 */

// Xóa lịch trình (chỉ ADMIN)
router.delete('/:id', 
  authenticateToken, 
  requireRole('ROLE_ADMIN'),
  scheduleController.deleteSchedule
);

// Cập nhật trạng thái yêu cầu đặt lịch (ADMIN hoặc DOCTOR với lịch của chính họ)
router.patch('/appointments/:id', 
  authenticateToken, 
  (req, res, next) => {
    const roleCheck = requireRole('ROLE_DOCTOR');
    const adminCheck = requireRole('ROLE_ADMIN');
    
    adminCheck(req, res, (err) => {
      if (!err) return next();
      
      roleCheck(req, res, (err) => {
        if (!err) {
          // Kiểm tra appointment thuộc bác sĩ đó hay không sẽ được xử lý trong controller
          next();
        } else {
          return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
      });
    });
  },
  validateUpdateAppointmentStatus,
  scheduleController.updateAppointmentStatus
);

module.exports = router;