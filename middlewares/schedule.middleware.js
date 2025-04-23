const { check, validationResult  } = require('express-validator');
const { Schedule, Doctor, Department, ServicePackage } = require('../models');

// Middleware để validate service_type và service_id
const validateServiceTypeAndId = async (req, res, next) => {
  try {
    const { type, service_id } = req.body;
    
    if (!type || !service_id) {
      return res.status(400).json({
        success: false,
        message: 'Both type and service_id are required'
      });
    }
    
    let model;
    switch (type) {
      case 'general':
      case 'medical':
        model = ServicePackage;
        // Kiểm tra xem service_id có thuộc loại này không
        const servicePackage = await model.findByPk(service_id);
        if (!servicePackage || servicePackage.type !== type) {
          return res.status(400).json({
            success: false,
            message: `Service ID ${service_id} is not valid for type ${type}`
          });
        }
        break;
      case 'specialist':
      case 'specialist_online': 
        model = Department;
        const department = await model.findByPk(service_id);
        if (!department) {
          return res.status(400).json({
            success: false,
            message: `Invalid service_id for type ${type}`
          });
        }
        // Nếu có trường service_type trong Department model để phân biệt
        // if (department.service_type !== type) {
        //   return res.status(400).json({
        //     success: false,
        //     message: `Service ID ${service_id} is not valid for type ${type}`
        //   });
        // }
        break;
      default:
        return res.status(400).json({
          success: false,
          message: `Invalid service type: ${type}`
        });
    }
    
    next();
  } catch (error) {
    console.error('Error in validateServiceTypeAndId:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Middleware kiểm tra bác sĩ có quyền cập nhật lịch của chính mình không
const checkDoctorOwnership = async (req, res, next) => {
  try {
    // Nếu là ADMIN thì cho phép mọi thao tác
    if (req.user.roles.includes('ROLE_ADMIN')) {
      return next();
    }
    
    // Kiểm tra nếu user là DOCTOR
    if (!req.user.roles.includes('ROLE_DOCTOR')) {
      return res.status(403).json({ 
        success: false,
        message: 'Forbidden: Insufficient permissions' 
      });
    }
    
    // Lấy doctor_id từ request
    let doctorId;
    
    // Nếu là route create schedule
    if (req.method === 'POST' && req.body.doctor_id) {
      doctorId = req.body.doctor_id;
    } 
    // Nếu là route update/delete schedule
    else if ((req.method === 'PUT' || req.method === 'DELETE') && req.params.id) {
      const schedule = await Schedule.findByPk(req.params.id);
      if (!schedule) {
        return res.status(404).json({ 
          success: false,
          message: 'Schedule not found' 
        });
      }
      doctorId = schedule.doctor_id;
    }
    
    // Kiểm tra nếu doctor_id là của chính user đang đăng nhập
    if (doctorId !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Forbidden: You can only manage your own schedules' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Error in checkDoctorOwnership:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server Error' 
    });
  }
};

// Validation cho route get all schedules
const validateGetAllSchedules = [
  check('page').optional().isInt({ min: 1 }).toInt(),
  check('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  check('doctor_id').optional().isUUID(),
  check('type').optional().isIn(['service_package', 'specialty', 'online']),
  check('status').optional().isIn(['available', 'booked', 'cancelled', 'completed']),
  check('date_from').optional().isDate(),
  check('date_to').optional().isDate()
];

// Validation cho route get doctor schedules
const validateGetDoctorSchedules = [
  check('page').optional().isInt({ min: 1 }).toInt(),
  check('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  check('status').optional().isIn(['available', 'booked', 'cancelled', 'completed']),
  check('date_from').optional().isDate(),
  check('date_to').optional().isDate(),
  check('type').optional().isIn(['service_package', 'specialty', 'online']),
];

// Validation cho route create schedule
// Trong file schedule.middleware.js
const validateCreateSchedule = [
  // Có thể bạn cần xem lại validateServiceTypeAndId này
  check('doctor_id').isUUID().notEmpty(),
  check('date').isDate().notEmpty(),
  check('start_time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).notEmpty(),
  check('end_time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).notEmpty(),
  // Sửa để phù hợp với model
  check('type').isIn(['general', 'medical', 'specialist', 'specialist_online']).notEmpty(),
  check('service_id').isInt({ min: 1 }).notEmpty()
];

// Validation cho route update schedule
const validateUpdateSchedule = [
  validateServiceTypeAndId,
  check('status').optional().isIn(['available', 'booked', 'cancelled', 'completed'])
];

// Validation cho route create appointment
const validateCreateAppointment = [
  check('schedule_id').isUUID().notEmpty(),
  check('patient_name').isString().notEmpty(),
  check('patient_phone').matches(/^[0-9+\-\s]+$/).notEmpty(),
  check('patient_email').optional().isEmail(),
  check('notes').optional().isString()
];

// Validation cho route update appointment status
const validateUpdateAppointmentStatus = [
  check('status').isIn(['pending', 'confirmed', 'rejected', 'completed']).notEmpty()
];

// Validation cho create package booking request
const validateCreatePackageBookingRequest = [
  check('package_id').isInt({ min: 1 }).notEmpty(),
  check('package_type').isIn(['general', 'medical']).notEmpty(),
  check('requested_date').isDate().notEmpty(),
  check('requested_time_slot').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/).notEmpty(),
  check('notes').optional().isString()
];

// Validation cho request assignment
const validateRequestAssignment = [
  check('booking_request_id').isInt({ min: 1 }).notEmpty(),
  check('doctor_note').optional().isString()
];

// Validation cho approve assignment
const validateApproveAssignment = [
  check('status').isIn(['approved', 'rejected_by_admin']).notEmpty(),
  check('admin_note').optional().isString()
];

// Validation cho assign doctor
const validateAssignDoctor = [
  check('booking_request_id').isInt({ min: 1 }).notEmpty(),
  check('doctor_id').isUUID().notEmpty(),
  check('admin_note').optional().isString()
];

module.exports = {
  validateServiceTypeAndId,
  checkDoctorOwnership,
  validateGetAllSchedules,
  validateGetDoctorSchedules,
  validateCreateSchedule,
  validateUpdateSchedule,
  validateCreateAppointment,
  validateUpdateAppointmentStatus,
  validateCreatePackageBookingRequest,
  validateRequestAssignment,
  validateApproveAssignment,
  validateAssignDoctor
};