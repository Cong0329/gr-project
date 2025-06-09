const { PaymentMethod, Appointment, Schedule, User, Doctor, sequelize, Department, ServicePackage } = require('../models');
const { validationResult } = require('express-validator');
const { buildApointmentVNPayUrl } = require('../utils/vnpay');
/**
 * Tạo yêu cầu đặt lịch khám thông thường - Có thể dùng cho USER và PUBLIC
 */
exports.createAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { doctor_id, date, start_time, end_time, type, service_id, payment_method } = req.body;
    console.log(payment_method);

    // Validate payment method
    const paymentMethod = await PaymentMethod.findOne({ where: { method: payment_method } });

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    // Check valid appointment type
    if (!['specialist', 'specialist_online'].includes(type)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment type, only specialist or specialist_online accepted'
      });
    }

    // Check if date is in the future
    const appointmentDate = new Date(`${date} ${start_time}`);
    if (appointmentDate < new Date()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot book appointment in the past'
      });
    }

    // Find available schedule
    const schedule = await Schedule.findOne({
      where: {
        doctor_id,
        date,
        start_time,
        end_time,
        type,
        service_id,
        status: 'available'
      },
      transaction
    });




    if (!schedule) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'No available schedule found or already booked'
      });
    }
    const department = await Department.findOne({ where: { id: schedule.service_id } });


    // Process payment (simplified example)
    let paymentStatus = 'pending';
    // if (payment_method === 'cash') {
    //   paymentStatus = 'confirmed';
    // } else if (payment_method === 'online') {
    //   // Here you would integrate with payment gateway
    //   // For now we simulate success
    //   paymentStatus = 'confirmed';
    // }
    if (payment_method === 'cash') {
      paymentStatus = 'confirmed';
    } else if (payment_method === 'vnpay') {
      paymentStatus = 'pending';
    }

    // Update schedule status
    await schedule.update({ status: 'booked' }, { transaction });
    const priceStr = department.price;
    const amount = parseFloat(priceStr.replace('VND', '').replace(/\./g, '').trim());
    // Create appointment
    let appointmentData = {
      ...req.body,
      status: paymentStatus === 'confirmed' ? 'confirmed' : 'pending_payment',
      schedule_id: schedule.id,
      amount: amount,
      payment_status: paymentStatus
    };

    if (req.user) {
      appointmentData.user_id = req.user.id;
    }

    const appointment = await Appointment.create(appointmentData, { transaction });

    await transaction.commit();

    if (payment_method === 'vnpay') {
      const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const paymentUrl = buildApointmentVNPayUrl(appointment.id, amount, ipAddr);

      return res.status(200).json({
        message: 'Redirect to VNPay',
        paymentUrl,
        apointmentId: appointment.id,
      });
    }




    // Log successful booking
    console.log(`Appointment created: ${appointment.id} for ${date} ${start_time}`);

    res.status(201).json({
      success: true,
      message: paymentStatus === 'confirmed'
        ? 'Appointment booked successfully'
        : 'Appointment created, please complete payment',
      data: appointment
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Cập nhật trạng thái yêu cầu đặt lịch - Yêu cầu ADMIN hoặc DOCTOR
 */
exports.updateAppointmentStatus = async (req, res) => {
  console.log('Received body:', req.body);

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Kiểm tra nếu là DOCTOR thì chỉ được cập nhật các lịch hẹn của họ
    if (req.user && req.user.role === 'ROLE_DOCTOR' && appointment.doctor_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update appointments assigned to you'
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
};

/**
 * Lấy danh sách lịch hẹn - Cho ADMIN, DOCTOR, hoặc USER (với bộ lọc)
 */
exports.getAppointments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      doctor_id,
      user_id,
      status,
      date_from,
      date_to
    } = req.query;

    // Xây dựng điều kiện tìm kiếm
    const whereClause = {};

    // Nếu là doctor, chỉ lấy lịch hẹn của họ
    if (req.user && req.user.role === 'ROLE_DOCTOR') {
      whereClause.doctor_id = req.user.id;
    }
    // Nếu là user, chỉ lấy lịch hẹn của họ
    else if (req.user && req.user.role === 'ROLE_USER') {
      whereClause.user_id = req.user.id;
    }
    // Nếu là admin, có thể lấy tất cả hoặc lọc theo điều kiện
    else {
      if (doctor_id) whereClause.doctor_id = doctor_id;
      if (user_id) whereClause.user_id = user_id;
    }

    // Thêm các bộ lọc khác
    if (status) whereClause.status = status;

    // Lọc theo khoảng ngày
    if (date_from || date_to) {
      whereClause.date = {};
      if (date_from) whereClause.date[Op.gte] = new Date(date_from);
      if (date_to) whereClause.date[Op.lte] = new Date(date_to);
    }

    const appointments = await Appointment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone', 'avatar_url']
        },
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name', 'avatar', 'position', 'department_id']
        },
        {
          model: Schedule,
          as: 'schedule'
        }
      ],
      order: [['date', 'ASC'], ['start_time', 'ASC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      appointments: appointments.rows,
      total: appointments.count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(appointments.count / parseInt(limit))
    });
  } catch (error) {
    console.error('Error in getAppointments:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

/**
 * Lấy chi tiết một lịch hẹn
 */
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone', 'avatar_url']
        },
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name', 'avatar', 'position', 'department_id']
        },
        {
          model: Schedule,
          as: 'schedule'
        }
      ]
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Kiểm tra quyền truy cập (USER chỉ xem được lịch hẹn của họ)
    if (req.user && req.user.role === 'ROLE_USER' && appointment.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this appointment'
      });
    }

    // Kiểm tra quyền truy cập (DOCTOR chỉ xem được lịch hẹn được gán cho họ)
    if (req.user && req.user.role === 'ROLE_DOCTOR' && appointment.doctor_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this appointment'
      });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Error in getAppointmentById:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

/**
 * Hủy lịch hẹn
 */
exports.cancelAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const appointment = await Appointment.findByPk(req.params.id, { transaction });

    if (!appointment) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Kiểm tra quyền (USER chỉ hủy được lịch hẹn của họ)
    if (req.user && req.user.role === 'ROLE_USER' && appointment.user_id !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this appointment'
      });
    }

    // Kiểm tra trạng thái - chỉ có thể hủy những lịch chưa hoàn thành
    if (['completed', 'cancelled'].includes(appointment.status)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Cannot cancel appointment with status: ${appointment.status}`
      });
    }

    // Cập nhật trạng thái lịch hẹn
    await appointment.update({
      status: 'cancelled',
      notes: req.body.reason || 'Cancelled by user'
    }, { transaction });

    // Cập nhật trạng thái lịch nếu có
    if (appointment.schedule_id) {
      const schedule = await Schedule.findByPk(appointment.schedule_id, { transaction });
      if (schedule) {
        await schedule.update({ status: 'available' }, { transaction });
      }
    }

    // TODO: Xử lý hoàn tiền nếu cần

    await transaction.commit();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error in cancelAppointment:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};


exports.getUserAppointment = async (req, res) => {
  try {
    // Lấy user_id từ request (từ middleware xác thực JWT)
    const userId = req.user.id;
    console.log("User ID:", userId); // Debug


    // Tìm tất cả các cuộc hẹn của user
    const appointments = await Appointment.findAll({
      where: {
        user_id: userId
      },
      include: [
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name', 'avatar', 'type', 'user_id']
        },
        {
          model: Schedule,
          as: 'schedule'
        }
      ],
      order: [
        ['date', 'DESC'],
        ['start_time', 'DESC']
      ]
    });

    // Lấy thông tin service cho mỗi appointment
    const enrichedAppointments = await Promise.all(appointments.map(async (appointment) => {
      const appointmentData = appointment.toJSON();
      let serviceInfo = null;

      try {
        // Lấy thông tin service dựa trên loại appointment
        if (appointment.type === 'specialist' || appointment.type === 'specialist_online') {
          serviceInfo = await Department.findByPk(appointment.service_id, {
            attributes: ['id', 'name', 'price']
          });
        } else if (appointment.type === 'general' || appointment.type === 'medical') {
          serviceInfo = await ServicePackage.findByPk(appointment.service_id, {
            attributes: ['id', 'name', 'description', 'price']
          });
        }
      } catch (error) {
        console.error('Error fetching service info:', error);
      }

      return {
        ...appointmentData,
        serviceInfo: serviceInfo ? serviceInfo.toJSON() : null
      };
    }));

    res.status(200).json({
      success: true,
      data: enrichedAppointments

    });
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("User ID:", userId);

    const doctor = await Doctor.findOne({
      where: {
        user_id: userId
      }
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const doctorId = doctor.id;
    console.log("Doctor ID:", doctorId);

    const appointments = await Appointment.findAll({
      where: {
        doctor_id: doctorId
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone', 'avatar_url']
        },
        {
          model: Schedule,
          as: 'schedule'
        }
      ],
      order: [
        ['date', 'DESC'],
        ['start_time', 'DESC']
      ]
    });

    console.log("Found appointments:", appointments.length);

    const enrichedAppointments = await Promise.all(appointments.map(async (appointment) => {
      const appointmentData = appointment.toJSON();
      let serviceInfo = null;
      
      try {
        if (appointment.type === 'specialist' || appointment.type === 'specialist_online') {
          serviceInfo = await Department.findByPk(appointment.service_id, {
            attributes: ['id', 'name', 'price']
          });
        } else if (appointment.type === 'general' || appointment.type === 'medical') {
          serviceInfo = await ServicePackage.findByPk(appointment.service_id, {
            attributes: ['id', 'name', 'description', 'price']
          });
        }
      } catch (error) {
        console.error('Error fetching service info:', error);
      }

      return {
        ...appointmentData,
        serviceInfo: serviceInfo ? serviceInfo.toJSON() : null,
        patient_info: appointmentData.patient_info || {
          name: appointmentData.patient_name,
          phone: appointmentData.patient_phone,
          email: appointmentData.patient_email,
          gender: appointmentData.patient_gender,
          dob: appointmentData.patient_dob,
          address: appointmentData.patient_address,
          reason: appointmentData.reason
        }
      };
    }));

    res.status(200).json({
      success: true,
      data: enrichedAppointments
    });
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};
