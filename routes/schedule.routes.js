const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Schedule, Doctor, Department, GeneralPackage, MedicalPackage } = require('../models');
const { Op } = require('sequelize');
const { validateServiceTypeAndId } = require('../middlewares/scheduleValidation.middleware');

/**
 * @route GET /api/v1/schedule
 * @desc Lấy tất cả lịch trình (có phân trang, lọc theo doctor/type/status)
 * @access Public
 */
router.get('/', [
  check('page').optional().isInt({ min: 1 }).toInt(),
  check('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  check('doctor_id').optional().isUUID(),
  check('type').optional().isIn(['general', 'medical', 'specialist', 'specialist_online']),
  check('status').optional().isIn(['available', 'booked', 'cancelled', 'completed']),
  check('date_from').optional().isDate(),
  check('date_to').optional().isDate()
], async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { 
      page = 1, 
      limit = 10, 
      doctor_id, 
      type, 
      status,
      date_from,
      date_to
    } = req.query;

    const whereClause = {};
    if (doctor_id) whereClause.doctor_id = doctor_id;
    if (type) whereClause.type = type;
    if (status) whereClause.status = status;
    
    // Lọc theo khoảng ngày
    if (date_from || date_to) {
      whereClause.date = {};
      if (date_from) whereClause.date[Op.gte] = new Date(date_from);
      if (date_to) whereClause.date[Op.lte] = new Date(date_to);
    }

    const schedules = await Schedule.findAndCountAll({
      where: whereClause,
      include: [
        { 
          model: Doctor, 
          as: 'doctor',
          attributes: ['id', 'name', 'avatar', 'position', 'department_id'],
          include: [
            {
              model: Department,
              as: 'department',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [['date', 'ASC'], ['start_time', 'ASC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    // Trả về dữ liệu theo đúng format mà React đang mong đợi
    res.json(schedules.rows);
  } catch (error) {
    console.error('Error in GET /api/v1/schedule:', error);
    next(error);
  }
});

/**
 * @route GET /api/v1/schedule/specialist
 * @desc Lấy lịch trình bác sĩ chuyên khoa
 * @access Public
 */
router.get('/specialist', async (req, res, next) => {
  try {
    const { type, department_id } = req.query;

    // Validate type
    if (!type || (type !== 'specialty' && type !== 'online')) {
      return res.status(400).json({
        error: 'Invalid type parameter. Must be "specialty" or "online"'
      });
    }

    // Tạo object where cho Doctor
    const doctorWhere = { type };

    // Nếu có department_id thì thêm điều kiện vào where
    if (department_id) {
      doctorWhere.department_id = department_id;
    }

    const schedules = await Schedule.findAll({
      include: [
        {
          model: Doctor,
          as: 'doctor',
          where: doctorWhere,
          attributes: [
            'id',
            'name',
            'avatar',
            'position',
            'department_id',
            'type',
            'experience',
            'address'
          ],
          include: [
            {
              model: Department,
              as: 'department',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [['date', 'ASC'], ['start_time', 'ASC']]
    });

    res.json(schedules);
  } catch (error) {
    console.error('Error in GET /api/v1/schedule/specialist:', error);
    next(error);
  }
});


/**
 * @route GET /api/v1/schedule/general
 * @desc Lấy lịch trình bác sĩ khám tổng quát
 * @access Public
 */
router.get('/general', async (req, res, next) => {
  try {
    const schedules = await Schedule.findAll({
      where: {
        type: 'general'
      },
      include: [
        { 
          model: Doctor, 
          as: 'doctor',
          attributes: ['id', 'name', 'avatar', 'position', 'department_id', 'type', 'experience', 'address'],
          include: [
            {
              model: Department,
              as: 'department',
              attributes: ['id', 'name']
            }
          ]
        },
        {
          model: GeneralPackage,
          as: 'general_pkg',
          attributes: ['id', 'name', 'price', 'description']
        }
      ],
      order: [['date', 'ASC'], ['start_time', 'ASC']]
    });

    res.json(schedules);
  } catch (error) {
    console.error('Error in GET /api/v1/schedule/general:', error);
    next(error);
  }
});

/**
 * @route GET /api/v1/schedule/medical
 * @desc Lấy lịch trình khám gói y tế
 * @access Public
 */
router.get('/medical', async (req, res, next) => {
  try {
    const schedules = await Schedule.findAll({
      where: {
        type: 'medical'
      },
      include: [
        { 
          model: Doctor, 
          as: 'doctor',
          attributes: ['id', 'name', 'avatar', 'position']
        },
        {
          model: MedicalPackage,
          as: 'medical_pkg',
          attributes: ['id', 'name', 'price', 'description']
        }
      ],
      order: [['date', 'ASC'], ['start_time', 'ASC']]
    });

    res.json(schedules);
  } catch (error) {
    console.error('Error in GET /api/v1/schedule/medical:', error);
    next(error);
  }
});

/**
 * @route GET /api/v1/schedule/doctor/:doctorId
 * @desc Lấy tất cả lịch trình của một bác sĩ cụ thể (có phân trang)
 * @access Public
 */
router.get('/doctor/:doctorId', [
  check('page').optional().isInt({ min: 1 }).toInt(),
  check('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  check('status').optional().isIn(['available', 'booked', 'cancelled', 'completed']),
  check('date_from').optional().isDate(),
  check('date_to').optional().isDate(),
  check('type').optional().isIn(['general', 'medical', 'specialist', 'specialist_online']),
], async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const doctorId = req.params.doctorId;
    
    // Kiểm tra bác sĩ có tồn tại không
    const doctor = await Doctor.findByPk(doctorId, {
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name']
        }
      ]
    });
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found' 
      });
    }

    const { 
      page = 1, 
      limit = 10,
      status,
      date_from,
      date_to,
      type
    } = req.query;

    const whereClause = {
      doctor_id: doctorId
    };
    
    if (status) whereClause.status = status;
    if (type) whereClause.type = type;
    
    // Lọc theo khoảng ngày
    if (date_from || date_to) {
      whereClause.date = {};
      if (date_from) whereClause.date[Op.gte] = new Date(date_from);
      if (date_to) whereClause.date[Op.lte] = new Date(date_to);
    }

    const schedules = await Schedule.findAll({
      where: whereClause,
      include: [
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name', 'avatar', 'position', 'type', 'experience', 'address'],
          include: [
            {
              model: Department,
              as: 'department',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [['date', 'ASC'], ['start_time', 'ASC']]
    });

    res.json(schedules);
  } catch (error) {
    console.error('Error in GET /api/v1/schedule/doctor/:doctorId:', error);
    next(error);
  }
});

/**
 * @route GET /api/v1/schedule/:id
 * @desc Lấy chi tiết lịch trình kèm thông tin service tương ứng
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id, {
      include: [
        { 
          model: Doctor, 
          as: 'doctor',
          attributes: ['id', 'name', 'avatar', 'position', 'type', 'experience', 'address'],
          include: [
            {
              model: Department,
              as: 'department',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    if (!schedule) {
      return res.status(404).json({ 
        success: false,
        message: 'Schedule not found' 
      });
    }

    // Lấy thông tin service tương ứng
    let service = null;
    
    switch (schedule.type) {
      case 'general':
        service = await GeneralPackage.findByPk(schedule.service_id);
        schedule.dataValues.general_pkg = service;
        break;
      case 'medical':
        service = await MedicalPackage.findByPk(schedule.service_id);
        schedule.dataValues.medical_pkg = service;
        break;
      case 'specialist':
      case 'specialist_online':
        service = await Department.findByPk(schedule.service_id);
        schedule.dataValues.department = service;
        break;
    }

    res.json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server Error' 
    });
  }
});

/**
 * @route POST /api/v1/schedule
 * @desc Tạo lịch trình mới
 * @access Public (Tạm thời bỏ xác thực)
 */
router.post('/', [
  validateServiceTypeAndId,
  check('doctor_id').isUUID().notEmpty(),
  check('date').isDate().notEmpty(),
  check('start_time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).notEmpty(),
  check('end_time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).notEmpty(),
  check('type').isIn(['general', 'medical', 'specialist', 'specialist_online']).notEmpty(),
  check('service_id').isInt({ min: 1 }).notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    // Kiểm tra xung đột lịch trình
    const conflictingSchedule = await Schedule.findOne({
      where: {
        doctor_id: req.body.doctor_id,
        date: req.body.date,
        [Op.or]: [
          {
            start_time: { [Op.lt]: req.body.end_time },
            end_time: { [Op.gt]: req.body.start_time }
          }
        ]
      }
    });

    if (conflictingSchedule) {
      return res.status(400).json({ 
        success: false,
        message: 'Schedule conflicts with existing appointment',
        conflictingSchedule
      });
    }

    // Mặc định status là available khi tạo mới
    const scheduleData = {
      ...req.body,
      status: req.body.status || 'available'
    };

    const newSchedule = await Schedule.create(scheduleData);
    
    // Để phù hợp với frontend, lấy lại schedule kèm thông tin liên quan
    const completeSchedule = await Schedule.findByPk(newSchedule.id, {
      include: [
        { 
          model: Doctor, 
          as: 'doctor',
          attributes: ['id', 'name', 'avatar', 'position']
        }
      ]
    });

    res.status(201).json(completeSchedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server Error' 
    });
  }
});

/**
 * @route PUT /api/v1/schedule/:id
 * @desc Cập nhật lịch trình
 * @access Public (Tạm thời bỏ xác thực)
 */
router.put('/:id', [
  validateServiceTypeAndId,
  check('status').optional().isIn(['available', 'booked', 'cancelled', 'completed'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) {
      return res.status(404).json({ 
        success: false,
        message: 'Schedule not found' 
      });
    }

    // Chỉ cho phép cập nhật một số trường nhất định
    const updatableFields = ['status', 'start_time', 'end_time', 'date'];
    const updates = {};
    
    for (const field of updatableFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    await schedule.update(updates);
    
    // Lấy lại schedule kèm thông tin liên quan
    const updatedSchedule = await Schedule.findByPk(schedule.id, {
      include: [
        { 
          model: Doctor, 
          as: 'doctor',
          attributes: ['id', 'name', 'avatar', 'position']
        }
      ]
    });

    res.json(updatedSchedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server Error' 
    });
  }
});

/**
 * @route DELETE /api/v1/schedule/:id
 * @desc Xóa lịch trình
 * @access Public (Tạm thời bỏ xác thực)
 */
router.delete('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) {
      return res.status(404).json({ 
        success: false,
        message: 'Schedule not found' 
      });
    }

    // Kiểm tra nếu lịch đã được đặt thì không cho xóa
    if (schedule.status === 'booked') {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot delete booked schedule' 
      });
    }

    await schedule.destroy();
    res.json({ 
      success: true,
      message: 'Schedule deleted successfully' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server Error' 
    });
  }
});

/**
 * @route POST /api/v1/schedule/appointments
 * @desc Tạo yêu cầu đặt lịch khám
 * @access Public (Tạm thời bỏ xác thực)
 */
router.post('/appointments', [
  check('doctor_id').isUUID().notEmpty(),
  check('patient_name').isString().notEmpty(),
  check('patient_phone').matches(/^[0-9+\-\s]+$/).notEmpty(),
  check('service_type').isIn(['general', 'medical', 'specialist', 'specialist_online']).notEmpty(),
  check('service_id').isInt({ min: 1 }).notEmpty(),
  check('preferred_date').isDate().notEmpty(),
  check('preferred_time').optional().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    // Giả định bạn có model Appointment (nếu chưa, hãy tạo nó)
    const appointment = await Appointment.create({
      ...req.body,
      status: 'pending'
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server Error' 
    });
  }
});

/**
 * @route PATCH /api/v1/schedule/appointments/:id
 * @desc Cập nhật trạng thái yêu cầu đặt lịch
 * @access Public (Tạm thời bỏ xác thực)
 */
router.patch('/appointments/:id', [
  check('status').isIn(['pending', 'confirmed', 'rejected']).notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    // Giả định bạn có model Appointment
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: 'Appointment not found' 
      });
    }

    await appointment.update({ status: req.body.status });
    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server Error' 
    });
  }
});

module.exports = router;