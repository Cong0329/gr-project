const { PackageBookingRequest, Schedule, ServicePackage, Doctor, DoctorAssignment, sequelize } = require('../models');
const { Op } = require('sequelize');

// Hàm tạo booking request
exports.createBookingRequest = async (req, res) => {
  try {
    const { user_id, package_type, package_id, requested_date, requested_time_slot, notes } = req.body;
    
    // Kiểm tra gói dịch vụ tồn tại
    const servicePackage = await ServicePackage.findByPk(package_id);
    if (!servicePackage) {
      return res.status(404).json({ message: 'Không tìm thấy gói dịch vụ' });
    }
    
    const existingBooking = await PackageBookingRequest.findOne({
      where: {
        package_id,
        requested_date,
        requested_time_slot,
        status: {
          [Op.in]: ['pending', 'doctor_requested', 'assigned']
        }
      }
    });
    
    if (existingBooking) {
      return res.status(409).json({ 
        message: 'Khung giờ này đã được đặt bởi người khác. Vui lòng chọn khung giờ khác.',
        error_code: 'SLOT_ALREADY_BOOKED'
      });
    }
    
    // Tạo booking request
    const bookingRequest = await PackageBookingRequest.create({
      user_id,
      package_type,
      package_id,
      requested_date,
      requested_time_slot,
      notes,
      status: 'pending'
    });
    
    return res.status(201).json(bookingRequest);
  } catch (error) {
    console.error('Error creating booking request:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo yêu cầu đặt lịch' });
  }
};

// Hàm gán lịch cho booking request
exports.assignSchedule = async (req, res) => {
  try {
    const { booking_request_id, doctor_id, start_time, end_time } = req.body;
    
    // Tìm booking request
    const bookingRequest = await PackageBookingRequest.findByPk(booking_request_id);
    if (!bookingRequest) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu đặt lịch' });
    }
    
    // Tạo lịch với service_id chính là package_id
    const schedule = await Schedule.create({
      doctor_id,
      date: bookingRequest.requested_date,
      start_time,
      end_time,
      status: 'booked',
      type: bookingRequest.package_type,
      service_id: bookingRequest.package_id,
    });
    
    // Cập nhật booking request với schedule_id
    await bookingRequest.update({
      status: 'assigned',
      schedule_id: schedule.id
    });
    
    return res.status(200).json({ 
      message: 'Đã gán lịch thành công',
      schedule,
      bookingRequest
    });
  } catch (error) {
    console.error('Error assigning schedule:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi gán lịch' });
  }
};

// Hàm lấy chi tiết booking request với thông tin đầy đủ
exports.getBookingRequestDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const bookingRequest = await PackageBookingRequest.findByPk(id, {
      include: [
        { 
          association: 'package',
          attributes: ['id', 'name', 'type', 'description', 'price']
        },
        {
          association: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          association: 'schedule',
          include: [
            {
              association: 'doctor',
              attributes: ['id', 'name', 'type', 'avatar']
            }
          ]
        }
      ]
    });
    
    if (!bookingRequest) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu đặt lịch' });
    }
    
    return res.status(200).json(bookingRequest);
  } catch (error) {
    console.error('Error getting booking request details:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin chi tiết' });
  }
};

// Hàm lấy tất cả booking requests (cho admin/staff)
exports.getAllBookingRequests = async (req, res) => {
  try {
    const { status, from_date, to_date, page = 1, limit = 10 } = req.query;
    
    // Xây dựng điều kiện tìm kiếm
    const whereConditions = {};
    if (status) whereConditions.status = status;
    if (from_date && to_date) {
      whereConditions.requested_date = {
        [Op.between]: [from_date, to_date]
      };
    } else if (from_date) {
      whereConditions.requested_date = {
        [Op.gte]: from_date
      };
    } else if (to_date) {
      whereConditions.requested_date = {
        [Op.lte]: to_date
      };
    }
    
    // Tính toán offset cho phân trang
    const offset = (page - 1) * limit;
    
    // Thực hiện truy vấn với phân trang
    const { count, rows: bookingRequests } = await PackageBookingRequest.findAndCountAll({
      where: whereConditions,
      include: [
        { 
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: ServicePackage,
          as: 'package',
          attributes: ['id', 'name', 'type']
        },
        {
          model: Schedule,
          as: 'schedule',
          include: [
            {
              association: 'doctor',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });
    
    // Trả về kết quả với thông tin phân trang
    return res.status(200).json({
      total: count,
      total_pages: Math.ceil(count / limit),
      current_page: parseInt(page),
      bookingRequests
    });
  } catch (error) {
    console.error('Error getting booking requests:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách yêu cầu đặt lịch' });
  }
};

// Get user package booking requests
exports.getUserPackageBooking = async (req, res) => {
  try {
    // Lấy user_id từ request (từ middleware xác thực JWT)
    const userId = req.user.id;

    // Tìm tất cả các đặt gói khám của user
    const bookings = await PackageBookingRequest.findAll({
      where: {
        user_id: userId
      },
      include: [
        {

          model: ServicePackage,
          as: 'package',
          attributes: ['id', 'name', 'description', 'price', 'totalDuration', 'type']
        },
        {
          model: Schedule,
          as: 'schedule',
          include: [
            {
              model: Doctor,
              as: 'doctor',
              attributes: ['id', 'name', 'avatar', 'type']
            }
          ]
        }
      ],
      order: [
        ['requested_date', 'DESC'],
        ['created_at', 'DESC']
      ]
    });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching user package bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching package bookings',
      error: error.message
    });
  }
};

// Hàm hủy booking request
exports.cancelBookingRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellation_reason } = req.body;

    // Tìm booking request
    const bookingRequest = await PackageBookingRequest.findByPk(id);
    if (!bookingRequest) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu đặt lịch' });
    }

    // Kiểm tra quyền hạn: người dùng chỉ có thể hủy yêu cầu của chính họ
    if (req.user.role === 'user' && bookingRequest.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền hủy yêu cầu này' });
    }

    // ✅ Check trạng thái có được huỷ không
    const cancellableStatuses = ['pending', 'doctor_requested', 'assigned'];
    if (!cancellableStatuses.includes(bookingRequest.status)) {
      return res.status(400).json({
        message: `Không thể hủy yêu cầu ở trạng thái ${bookingRequest.status}`
      });
    }

    if (bookingRequest.schedule_id) {
      const schedule = await Schedule.findByPk(bookingRequest.schedule_id);
      if (schedule) {
        const scheduleDateTime = new Date(`${schedule.date}T${schedule.start_time}`);
        const now = new Date();
        const hoursUntilAppointment = (scheduleDateTime - now) / (1000 * 60 * 60);

        if (hoursUntilAppointment < 2) {
          return res.status(400).json({
            message: 'Không thể hủy lịch khám khi còn ít hơn 2 giờ'
          });
        }

        // Huỷ lịch nếu có
        await schedule.update({ status: 'cancelled' });
      }
    }

    // Cập nhật trạng thái booking request
    await bookingRequest.update({
      status: 'cancelled',
      cancellation_reason: cancellation_reason || 'Hủy bởi người dùng'
    });

    return res.status(200).json({
      message: 'Đã hủy yêu cầu đặt lịch thành công',
      bookingRequest
    });
  } catch (error) {
    console.error('Error cancelling booking request:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi hủy yêu cầu đặt lịch' });
  }
};


exports.getBookingRequests = async (req, res) => {
  try {
    const { date, package_id } = req.query;
    
    const whereClause = {};
    
    if (date) {
      whereClause.requested_date = date;
    }
    
    if (package_id) {
      whereClause.package_id = package_id; 
    }
    
    console.log('Query conditions:', whereClause);
    
    const bookings = await PackageBookingRequest.findAll({
      where: whereClause,
      attributes: [
        'id',
        'requested_date', 
        'requested_time_slot', 
        'status',
        'package_id'
      ],
    });
    
    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching booking requests:', error);
    return res.status(500).json({ 
      message: 'Đã xảy ra lỗi khi lấy danh sách yêu cầu đặt lịch',
      error: error.message 
    });
  }
};


