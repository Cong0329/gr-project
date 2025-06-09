const { Schedule, Doctor, Department, ServicePackage, Appointment, PackageBookingRequest, DoctorAssignment, User } = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const { sequelize } = require('../models');


exports.getAllSchedules = async (req, res, next) => {
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
    console.error('Error in getAllSchedules:', error);
    next(error);
  }
};

/**
 * Lấy lịch trình bác sĩ chuyên khoa
 */
exports.getSpecialistSchedules = async (req, res, next) => {
  try {
    // Định nghĩa ánh xạ giữa type của Doctor và type của Schedule
    const typeMapping = {
      'specialty': 'specialist',
      'online': 'specialist_online'
    };
    
    const { type, service_id, date, startDate, endDate, doctor_id, status } = req.query;

    // Kiểm tra và map type từ request
    let doctorType, scheduleType;
    
    if (type && (type === 'specialty' || type === 'online')) {
      doctorType = type; // Giá trị trong DB của Doctor
      scheduleType = typeMapping[type]; // Ánh xạ tới giá trị trong Schedule
    } else {
      // Nếu không có type hoặc type không hợp lệ, lấy cả hai loại
      doctorType = ['specialty', 'online'];
      scheduleType = ['specialist', 'specialist_online'];
    }

    console.log(`Tìm lịch: doctorType=${doctorType}, scheduleType=${scheduleType}`);

    // Điều kiện cho Schedule
    const scheduleWhere = {
      type: scheduleType
    };

    // Thêm các điều kiện lọc khác
    if (date) {
      scheduleWhere.date = date;
    } else if (startDate && endDate) {
      scheduleWhere.date = {
        [Op.between]: [startDate, endDate] 
      };
    }
    if (status) scheduleWhere.status = status;

    // Điều kiện cho Doctor
    const doctorWhere = {
      type: doctorType
    };
    
    if (doctor_id) doctorWhere.id = doctor_id;
    if (service_id) scheduleWhere.service_id = service_id;

    const schedules = await Schedule.findAll({
      where: scheduleWhere,
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

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error('Error in getSpecialistSchedules:', error);
    return res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách lịch chuyên khoa',
      error: error.message
    });
  }
};

/**
 * Lấy lịch trình cho các gói dịch vụ (cả general và medical)
 */
exports.getServicePackageSchedules = async (req, res, next) => {
  try {
    const { package_type } = req.query;
    
    const whereClause = {
      type: 'service_package'
    };
    
    // Nếu có chỉ định loại gói, thêm điều kiện để join với loại package tương ứng
    const packageInclude = {
      model: ServicePackage,
      as: 'service_package',
      attributes: ['id', 'name', 'price', 'description', 'type']
    };
    
    if (package_type) {
      packageInclude.where = { type: package_type };
    }

    const schedules = await Schedule.findAll({
      where: whereClause,
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
        packageInclude
      ],
      order: [['date', 'ASC'], ['start_time', 'ASC']]
    });

    res.json(schedules);
  } catch (error) {
    console.error('Error in getServicePackageSchedules:', error);
    next(error);
  }
};

/**
 * Lấy tất cả lịch trình của một bác sĩ cụ thể
 */
exports.getDoctorSchedules = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({
      where: { user_id: req.user.id },
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
        message: 'Doctor profile not found for this user'
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
      doctor_id: doctor.id 
    };
    
    if (status) whereClause.status = status;
    if (type) whereClause.type = type;
    
    if (date_from || date_to) {
      whereClause.date = {};
      if (date_from) whereClause.date[Op.gte] = new Date(date_from);
      if (date_to) whereClause.date[Op.lte] = new Date(date_to);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: schedules } = await Schedule.findAndCountAll({
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
      order: [['date', 'ASC'], ['start_time', 'ASC']],
      limit: parseInt(limit),
      offset: offset
    });

    // console.log('Found schedules:', schedules.length);

    res.json({
      success: true,
      data: schedules,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / parseInt(limit))
      },
      doctor: {
        id: doctor.id,         
        name: doctor.name,     
        department: doctor.department?.name
      }
    });

  } catch (error) {
    console.error('Error in getDoctorSchedules:', error);
    next(error);
  }
};

/**
 * Lấy chi tiết lịch trình kèm thông tin service tương ứng
 */
exports.getScheduleById = async (req, res) => {
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
      case 'service_package':
        service = await ServicePackage.findByPk(schedule.service_id);
        schedule.dataValues.service_package = service;
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
};

/**
 * Tạo lịch trình mới - Yêu cầu ADMIN hoặc DOCTOR
 */
exports.createSchedule = async (req, res) => {
  try {
    // console.log('🔥 User:', req.user);
    // console.log('🔥 Roles:', req.user?.roles);
    // console.log('🔥 Body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const doctor = await Doctor.findOne({
      where: { user_id: req.user.id }
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found for this user'
      });
    }

    // Kiểm tra xung đột lịch trình với doctor_id từ database
    const conflictingSchedule = await Schedule.findOne({
      where: {
        doctor_id: doctor.id, // Dùng doctor.id thay vì req.body.doctor_id
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

    // Tạo scheduleData với doctor_id từ database
    const scheduleData = {
      ...req.body,
      doctor_id: doctor.id, // Ghi đè doctor_id
      status: req.body.status || 'available'
    };

    const newSchedule = await Schedule.create(scheduleData);
    
    // Lấy lại schedule kèm thông tin liên quan
    const completeSchedule = await Schedule.findByPk(newSchedule.id, {
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

    res.status(201).json({
      success: true,
      data: completeSchedule
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

/**
 * Cập nhật lịch trình - Yêu cầu ADMIN hoặc DOCTOR
 */
exports.updateSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { status, date, start_time, end_time } = req.body;
    const userId = req.user.id;

    const doctor = await Doctor.findOne({
      where: { user_id: userId }
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bác sĩ tương ứng.'
      });
    }

    const doctorId = doctor.id;
    
    // Kiểm tra schedule có tồn tại không
    const schedule = await Schedule.findByPk(scheduleId, {
      include: [
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name', 'avatar', 'position', 'type', 'experience', 'address']
        }
      ]
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch hẹn'
      });
    }

    // Kiểm tra quyền truy cập (chỉ bác sĩ sở hữu lịch mới được cập nhật)
    if (schedule.doctor_id !== doctorId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật lịch hẹn này'
      });
    }

    // Validate dữ liệu đầu vào
    const updateData = {};
    
    // Validate status
    if (status) {
      const validStatuses = ['available', 'booked', 'cancelled', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status không hợp lệ. Chỉ chấp nhận: available, booked, cancelled, completed'
        });
      }
      updateData.status = status;
    }

    // Validate date
    if (date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({
          success: false,
          message: 'Định dạng ngày không hợp lệ. Sử dụng YYYY-MM-DD'
        });
      }
      
      const inputDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (inputDate < today) {
        return res.status(400).json({
          success: false,
          message: 'Không thể đặt lịch vào ngày trong quá khứ'
        });
      }
      
      updateData.date = date;
    }

    // Validate time
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    
    if (start_time) {
      if (!timeRegex.test(start_time)) {
        return res.status(400).json({
          success: false,
          message: 'Định dạng giờ bắt đầu không hợp lệ. Sử dụng HH:MM'
        });
      }
      updateData.start_time = start_time;
    }

    if (end_time) {
      if (!timeRegex.test(end_time)) {
        return res.status(400).json({
          success: false,
          message: 'Định dạng giờ kết thúc không hợp lệ. Sử dụng HH:MM'
        });
      }
      updateData.end_time = end_time;
    }

    // Kiểm tra end_time phải sau start_time
    const finalStartTime = start_time || schedule.start_time;
    const finalEndTime = end_time || schedule.end_time;
    
    if (finalEndTime <= finalStartTime) {
      return res.status(400).json({
        success: false,
        message: 'Giờ kết thúc phải sau giờ bắt đầu'
      });
    }

    // Kiểm tra trùng lịch nếu có thay đổi về thời gian hoặc ngày
    if (date || start_time || end_time) {
      const finalDate = date || schedule.date;
      
      const conflictingSchedule = await Schedule.findOne({
        where: {
          id: { [Op.ne]: scheduleId },
          doctor_id: doctorId,
          date: finalDate,
          [Op.or]: [
            {
              start_time: { [Op.between]: [finalStartTime, finalEndTime] }
            },
            {
              end_time: { [Op.between]: [finalStartTime, finalEndTime] }
            },
            {
              [Op.and]: [
                { start_time: { [Op.lte]: finalStartTime } },
                { end_time: { [Op.gte]: finalEndTime } }
              ]
            }
          ],
          status: { [Op.notIn]: ['cancelled'] }
        }
      });

      if (conflictingSchedule) {
        return res.status(409).json({
          success: false,
          message: 'Đã có lịch hẹn khác trong khoảng thời gian này'
        });
      }
    }

    // 🔥 THÊM LOGIC SYNC STATUS VỚI BẢNG APPOINTMENTS
    // Sử dụng transaction để đảm bảo data consistency
    const transaction = await sequelize.transaction();
    
    try {
      // Cập nhật bảng Schedule
      await schedule.update(updateData, { transaction });

      // 🔥 Nếu có thay đổi status, cập nhật cả bảng Appointments
      if (status) {
        // Tìm appointment tương ứng với schedule này
        const appointment = await Appointment.findOne({
          where: {
            doctor_id: doctorId,
            date: schedule.date,
            start_time: schedule.start_time,
            end_time: schedule.end_time
          },
          transaction
        });

        if (appointment) {
          await appointment.update({ status: status }, { transaction });
          console.log(`Synced appointment ${appointment.id} status to: ${status}`);
        }
      }

      // Commit transaction
      await transaction.commit();

    } catch (error) {
      // Rollback nếu có lỗi
      await transaction.rollback();
      throw error;
    }

    // Lấy lại dữ liệu đã cập nhật với đầy đủ thông tin
    const updatedSchedule = await Schedule.findByPk(scheduleId, {
      include: [
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name', 'avatar', 'position', 'type', 'experience', 'address']
        }
      ]
    });

    // Log hoạt động
    console.log(`Schedule ${scheduleId} updated by doctor ${doctorId}:`, updateData);

    res.status(200).json({
      success: true,
      message: 'Cập nhật lịch hẹn thành công',
      data: updatedSchedule
    });

  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật lịch hẹn',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Xóa lịch trình - Yêu cầu ADMIN
 */
exports.deleteSchedule = async (req, res) => {
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
};

/**
 * Admin phê duyệt/từ chối đăng ký của bác sĩ
 */
exports.approveAssignment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { status, admin_note } = req.body;

    // Chỉ cho phép các trạng thái hợp lệ
    if (status !== 'approved' && status !== 'rejected_by_admin') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid status. Must be approved or rejected_by_admin' 
      });
    }

    // Kiểm tra xem assignment có tồn tại không
    const assignment = await DoctorAssignment.findByPk(id, {
      include: [
        {
          model: PackageBookingRequest,
          as: 'bookingRequest'
        }
      ]
    });

    if (!assignment) {
      return res.status(404).json({ 
        success: false,
        message: 'Assignment not found' 
      });
    }

    // Cập nhật trạng thái assignment
    await assignment.update({
      status,
      admin_note
    });

    // Nếu phê duyệt, cập nhật trạng thái booking request và tạo lịch
    if (status === 'approved') {
      // Cập nhật trạng thái booking request
      await assignment.bookingRequest.update({
        status: 'assigned'
      });

      // Tạo lịch mới cho bác sĩ và bệnh nhân
      const schedule = await Schedule.create({
        doctor_id: assignment.doctor_id,
        date: assignment.bookingRequest.requested_date,
        start_time: assignment.bookingRequest.requested_time_slot.split('-')[0],
        end_time: assignment.bookingRequest.requested_time_slot.split('-')[1],
        type: 'service_package',
        service_id: assignment.bookingRequest.package_id,
        status: 'booked'
      });

      // Cập nhật schedule_id vào booking request
      await assignment.bookingRequest.update({
        schedule_id: schedule.id
      });

      // Bổ sung thông tin lịch vào kết quả trả về
      assignment.dataValues.schedule = schedule;
    }

    res.json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server Error' 
    });
  }
};

/**
 * Admin chủ động phân công bác sĩ
 */
exports.assignDoctor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { booking_request_id, doctor_id, admin_note } = req.body;

    // Kiểm tra xem yêu cầu đặt lịch có tồn tại không
    const bookingRequest = await PackageBookingRequest.findByPk(booking_request_id);
    if (!bookingRequest) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking request not found' 
      });
    }

    // Kiểm tra xem bác sĩ có tồn tại không
    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) {
      return res.status(404).json({ 
        success: false,
        message: 'Doctor not found' 
      });
    }

    // Tạo mới assignment với trạng thái admin_assigned
    const assignment = await DoctorAssignment.create({
      booking_request_id,
      doctor_id,
      admin_note,
      status: 'admin_assigned'
    });

    // Cập nhật trạng thái booking request
    await bookingRequest.update({
      status: 'assigned'
    });

    // Tạo lịch mới cho bác sĩ và bệnh nhân
    const schedule = await Schedule.create({
      doctor_id: doctor_id,
      date: bookingRequest.requested_date,
      start_time: bookingRequest.requested_time_slot.split('-')[0],
      end_time: bookingRequest.requested_time_slot.split('-')[1],
      type: 'service_package',
      service_id: bookingRequest.package_id,
      status: 'booked'
    });

    // Cập nhật schedule_id vào booking request
    await bookingRequest.update({
      schedule_id: schedule.id
    });

    // Bổ sung thông tin lịch vào kết quả trả về
    assignment.dataValues.schedule = schedule;

    res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server Error' 
    });
  }
};