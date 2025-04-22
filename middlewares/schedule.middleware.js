const { check } = require('express-validator');
const { Doctor, GeneralPackage, MedicalPackage, Department } = require('../models');

// Middleware để validate service_type và service_id
const validateServiceTypeAndId = async (req, res, next) => {
  try {
    const { type, service_id } = req.body;
    
    if (!type || !service_id) {
      return next(); // Nếu không có một trong hai field, tiếp tục để express-validator xử lý
    }
    
    let exists = false;
    
    switch (type) {
      case 'general':
        exists = await GeneralPackage.findByPk(service_id);
        break;
      case 'medical':
        exists = await MedicalPackage.findByPk(service_id);
        break;
      case 'specialist':
      case 'specialist_online':
        exists = await Department.findByPk(service_id);
        break;
    }
    
    if (!exists) {
      return res.status(400).json({ 
        success: false,
        message: `Invalid service_id for type ${type}` 
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
    const userRoles = await req.user.getRoles();
    const isAdmin = userRoles.some(role => role.code === 'ROLE_ADMIN');
    if (isAdmin) {
      return next();
    }
    
    // Kiểm tra nếu user là DOCTOR
    const isDoctor = userRoles.some(role => role.code === 'ROLE_DOCTOR');
    if (!isDoctor) {
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
  check('type').optional().isIn(['general', 'medical', 'specialist', 'specialist_online']),
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
  check('type').optional().isIn(['general', 'medical', 'specialist', 'specialist_online']),
];

// Validation cho route create schedule
const validateCreateSchedule = [
  validateServiceTypeAndId,
  check('doctor_id').isUUID().notEmpty(),
  check('date').isDate().notEmpty(),
  check('start_time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).notEmpty(),
  check('end_time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).notEmpty(),
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
  check('doctor_id').isUUID().notEmpty(),
  check('patient_name').isString().notEmpty(),
  check('patient_phone').matches(/^[0-9+\-\s]+$/).notEmpty(),
  check('service_type').isIn(['general', 'medical', 'specialist', 'specialist_online']).notEmpty(),
  check('service_id').isInt({ min: 1 }).notEmpty(),
  check('preferred_date').isDate().notEmpty(),
  check('preferred_time').optional().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
];

// Validation cho route update appointment status
const validateUpdateAppointmentStatus = [
  check('status').isIn(['pending', 'confirmed', 'rejected']).notEmpty()
];

module.exports = {
  validateServiceTypeAndId,
  checkDoctorOwnership,
  validateGetAllSchedules,
  validateGetDoctorSchedules,
  validateCreateSchedule,
  validateUpdateSchedule,
  validateCreateAppointment,
  validateUpdateAppointmentStatus
};