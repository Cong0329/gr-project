const { DoctorAssignment, PackageBookingRequest, Doctor, User, Schedule, ServicePackage } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../models');


// Hàm tạo yêu cầu bác sĩ cho một booking request
exports.requestDoctorAssignment = async (req, res) => {
    try {
      const { booking_request_id, doctor_id, notes } = req.body;
      
      // 1. Kiểm tra booking request tồn tại và có thông tin thời gian
      const bookingRequest = await PackageBookingRequest.findByPk(booking_request_id);
      if (!bookingRequest) {
        return res.status(404).json({ message: 'Không tìm thấy yêu cầu đặt lịch' });
      }
      
      // Kiểm tra booking đã có thời gian chưa
      if (!bookingRequest.requested_time_slot || !bookingRequest.requested_date) {
        return res.status(400).json({ 
          message: 'Yêu cầu đặt lịch chưa có thông tin thời gian khám' 
        });
      }
      
      // 2. Kiểm tra định dạng thời gian
      const timeParts = bookingRequest.requested_time_slot.split(' - ').map(s => s.trim());
      if (timeParts.length !== 2) {
        return res.status(400).json({ 
          message: 'Định dạng thời gian không hợp lệ. Phải là "HH:mm - HH:mm"' 
        });
      }
      
      const [startTime, endTime] = timeParts;
      if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(startTime) || 
          !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(endTime)) {
        return res.status(400).json({ 
          message: 'Định dạng thời gian phải là HH:mm (ví dụ: 13:00)' 
        });
      }
      
      // 3. Kiểm tra doctor tồn tại
      const doctor = await Doctor.findByPk(doctor_id, {
        attributes: ['id', 'name', 'avatar', 'type']
      });
      if (!doctor) {
        return res.status(404).json({ message: 'Không tìm thấy bác sĩ' });
      }
      
      // 4. Kiểm tra xem đã có yêu cầu với doctor này chưa
      const existingAssignment = await DoctorAssignment.findOne({
        where: {
          booking_request_id,
          doctor_id
        }
      });
      
      if (existingAssignment) {
        return res.status(400).json({ 
          message: 'Đã có yêu cầu với bác sĩ này',
          status: existingAssignment.status 
        });
      }
      
      // 5. Tạo yêu cầu bác sĩ
      const doctorAssignment = await DoctorAssignment.create({
        booking_request_id,
        doctor_id,
        status: 'requested',
        notes,
        // Lưu thêm thông tin thời gian để tiện xử lý sau này
        requested_date: bookingRequest.requested_date,
        requested_time_slot: bookingRequest.requested_time_slot
      });
      
      return res.status(201).json({
        message: `Đã gửi yêu cầu khám lúc ${bookingRequest.requested_time_slot} ngày ${bookingRequest.requested_date} cho admin`,
        doctorAssignment,
        doctorInfo: {
          id: doctor.id,
          name: doctor.name,
          avatar: doctor.avatar,
          type: doctor.type
        }
      });

    } catch (error) {
      console.error('Error requesting doctor assignment:', error);
      return res.status(500).json({ 
        message: 'Đã xảy ra lỗi khi yêu cầu admin',
        error: error.message 
      });
    }
  };

// Hàm cập nhật trạng thái yêu cầu bác sĩ (approve/reject)
exports.updateDoctorAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    // Kiểm tra trạng thái hợp lệ
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }
    
    // Tìm doctor assignment
    const doctorAssignment = await DoctorAssignment.findByPk(id);
    if (!doctorAssignment) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu bác sĩ' });
    }
    
    // Kiểm tra quyền hạn
    // Nếu người dùng là bác sĩ, chỉ bác sĩ được gán mới có thể cập nhật
    if (req.user.role === 'doctor' && req.user.id !== doctorAssignment.doctor_id) {
      return res.status(403).json({ message: 'Bạn không có quyền cập nhật yêu cầu này' });
    }
    
    // Không thể thay đổi trạng thái nếu đã được approved/rejected
    if (doctorAssignment.status !== 'requested') {
      return res.status(400).json({ 
        message: `Không thể thay đổi trạng thái. Yêu cầu hiện tại: ${doctorAssignment.status}` 
      });
    }
    
    // Cập nhật doctor assignment
    await doctorAssignment.update({
      status,
      notes: notes || doctorAssignment.notes
    });
    
    // Lấy thông tin chi tiết cập nhật
    const updatedAssignment = await DoctorAssignment.findByPk(id, {
      include: [
        {
          model: PackageBookingRequest,
          as: 'bookingRequest',
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
            }
          ]
        },
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name', 'specialization', 'avatar']
        }
      ]
    });
    
    // Nếu bác sĩ đã chấp nhận, cập nhật trạng thái booking request
    if (status === 'approved') {
      // Model hook sẽ xử lý phần này
      return res.status(200).json({
        message: 'Đã chấp nhận yêu cầu thành công',
        doctorAssignment: updatedAssignment
      });
    }
    
    // Nếu bác sĩ từ chối
    if (status === 'rejected') {
      return res.status(200).json({
        message: 'Đã từ chối yêu cầu',
        doctorAssignment: updatedAssignment
      });
    }
  } catch (error) {
    console.error('Error updating doctor assignment:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật yêu cầu bác sĩ' });
  }
};

// Hàm lấy danh sách yêu cầu bác sĩ theo booking request
exports.getAssignmentsByBookingRequest = async (req, res) => {
  try {
    const { booking_request_id } = req.params;
    const { status } = req.query;
    
    // Kiểm tra booking request tồn tại
    const bookingRequest = await PackageBookingRequest.findByPk(booking_request_id);
    if (!bookingRequest) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu đặt lịch' });
    }
    
    // Xây dựng điều kiện tìm kiếm
    const whereConditions = { booking_request_id };
    if (status) whereConditions.status = status;
    
    // Lấy danh sách doctor assignments
    const doctorAssignments = await DoctorAssignment.findAll({
      where: whereConditions,
      include: [
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name', 'specialization', 'avatar']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    return res.status(200).json(doctorAssignments);
  } catch (error) {
    console.error('Error getting doctor assignments:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách yêu cầu bác sĩ' });
  }
};

// Hàm lấy danh sách yêu cầu bác sĩ theo doctor
exports.getAssignmentsByDoctor = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    
    // Kiểm tra doctor tồn tại
    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) {
      return res.status(404).json({ message: 'Không tìm thấy bác sĩ' });
    }
    
    // Kiểm tra quyền hạn: chỉ bác sĩ tự mình và admin/staff mới có thể xem
    if (req.user.role === 'doctor' && req.user.id !== doctor_id) {
      return res.status(403).json({ message: 'Bạn không có quyền xem yêu cầu của bác sĩ khác' });
    }
    
    // Xây dựng điều kiện tìm kiếm
    const whereConditions = { doctor_id };
    if (status) whereConditions.status = status;
    
    // Tính toán offset cho phân trang
    const offset = (page - 1) * limit;
    
    // Lấy danh sách doctor assignments với phân trang
    const { count, rows: doctorAssignments } = await DoctorAssignment.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: PackageBookingRequest,
          as: 'bookingRequest',
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
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [['created_at', 'DESC']]
    });
    
    // Trả về kết quả với thông tin phân trang
    return res.status(200).json({
      total: count,
      total_pages: Math.ceil(count / limit),
      current_page: parseInt(page),
      doctorAssignments
    });
  } catch (error) {
    console.error('Error getting doctor assignments:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách yêu cầu bác sĩ' });
  }
};

// Hàm lấy chi tiết yêu cầu bác sĩ
exports.getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doctorAssignment = await DoctorAssignment.findByPk(id, {
      include: [
        {
          model: PackageBookingRequest,
          as: 'bookingRequest',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'phone']
            },
            {
              model: ServicePackage,
              as: 'package',
              attributes: ['id', 'name', 'type', 'description']
            },
            {
              model: Schedule,
              as: 'schedule',
              include: [
                {
                  model: Doctor,
                  as: 'doctor',
                  attributes: ['id', 'name', 'specialization', 'avatar']
                }
              ]
            }
          ]
        },
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name', 'specialization', 'avatar', 'bio', 'email', 'phone']
        }
      ]
    });
    
    if (!doctorAssignment) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu bác sĩ' });
    }
    
    // Kiểm tra quyền hạn nếu là bác sĩ
    if (req.user.role === 'doctor' && req.user.id !== doctorAssignment.doctor_id) {
      return res.status(403).json({ message: 'Bạn không có quyền xem chi tiết yêu cầu này' });
    }
    
    return res.status(200).json(doctorAssignment);
  } catch (error) {
    console.error('Error getting doctor assignment details:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy chi tiết yêu cầu bác sĩ' });
  }
};

// Hàm tự động tạo schedule sau khi phê duyệt bác sĩ
exports.approveDoctorAndCreateSchedule = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { booking_request_id, doctor_id } = req.body;
  
      // 1. Tìm booking request và doctor assignment
      const bookingRequest = await PackageBookingRequest.findByPk(booking_request_id, {
        transaction,
        include: [{
          model: DoctorAssignment,
          as: 'doctorAssignments',
          where: { doctor_id },
          required: true
        }]
      });
  
      if (!bookingRequest) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Không tìm thấy yêu cầu đặt lịch' });
      }
  
      // 2. Validate và tách thời gian
      if (!bookingRequest.requested_time_slot) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Không có thời gian khám được yêu cầu' });
      }
  
      const timeParts = bookingRequest.requested_time_slot.split(' - ').map(s => s.trim());
      if (timeParts.length !== 2) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Định dạng thời gian không hợp lệ. Phải là "HH:mm - HH:mm"' });
      }
  
      const [requested_start_time, requested_end_time] = timeParts;
      
      // Validate định dạng HH:mm
      if (!isValidTimeFormat(requested_start_time) || !isValidTimeFormat(requested_end_time)) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Định dạng thời gian phải là HH:mm (ví dụ: 13:00)' });
      }
  
      // Validate thời gian hợp lệ
      const startMinutes = timeToMinutes(requested_start_time);
      const endMinutes = timeToMinutes(requested_end_time);
      
      if (startMinutes >= endMinutes) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Thời gian bắt đầu phải trước thời gian kết thúc' });
      }
  
      // 3. Kiểm tra trùng lịch
      const conflictingSchedule = await Schedule.findOne({
        where: {
          doctor_id,
          date: bookingRequest.requested_date,
          [Op.or]: [
            {
              start_time: { [Op.lt]: requested_end_time },
              end_time: { [Op.gt]: requested_start_time }
            }
          ]
        },
        transaction
      });
  
      if (conflictingSchedule) {
        await transaction.rollback();
        return res.status(400).json({
          message: 'Bác sĩ đã có lịch khám trùng giờ',
          conflicting_schedule: conflictingSchedule
        });
      }
  
       // 4. Tạo schedule mới
      const schedule = await Schedule.create({
        doctor_id,
        date: bookingRequest.requested_date,
        start_time: requested_start_time,
        end_time: requested_end_time,
        status: 'booked',
        type: bookingRequest.package_type,
        service_id: bookingRequest.package_id,
        patient_id: bookingRequest.patient_id
      }, { transaction });
  
      // 5. Phê duyệt bác sĩ
      await DoctorAssignment.update(
        { status: 'approved' },
        {
          where: {
            booking_request_id,
            doctor_id
          },
          transaction
        }
      );
  
      // 6. Từ chối các bác sĩ khác
      await DoctorAssignment.update(
        { status: 'rejected' },
        {
          where: {
            booking_request_id,
            doctor_id: { [Op.ne]: doctor_id },
            status: 'requested'
          },
          transaction
        }
      );
  
      // 7. Cập nhật trạng thái booking request
      await bookingRequest.update({
        status: 'assigned',
        schedule_id: schedule.id
      }, { transaction });
  
      await transaction.commit();
  
      return res.status(200).json({
        message: 'Đã phê duyệt bác sĩ và tạo lịch khám thành công',
        schedule,
        bookingRequest
      });
      
    } catch (error) {
      await transaction.rollback();
      console.error('Error in approveDoctorAndCreateSchedule:', error);
      return res.status(500).json({
        message: 'Đã xảy ra lỗi khi phê duyệt bác sĩ và tạo lịch khám',
        error: error.message
      });
    }
  };
  // Hàm helper
  function isValidTimeFormat(time) {
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  }
  
  function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

// Hàm lấy booking requests với thông tin doctor assignments
exports.getBookingRequestWithAssignments = async (req, res) => {
    try {
      const { id } = req.params;
      
      const bookingRequest = await PackageBookingRequest.findByPk(id, {
        include: [
          { 
            model: ServicePackage,
            as: 'package',
            attributes: ['id', 'name', 'type', 'description', 'price']
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'phone']
          },
          {
            model: Schedule,
            as: 'schedule',
            include: [
              {
                model: Doctor,
                as: 'doctor',
                attributes: ['id', 'name', 'specialization', 'avatar']
              }
            ]
          },
          {
            model: DoctorAssignment,
            as: 'doctorAssignments',
            include: [
              {
                model: Doctor,
                as: 'doctor',
                attributes: ['id', 'name', 'specialization', 'avatar']
              }
            ]
          }
        ]
      });
      
      if (!bookingRequest) {
        return res.status(404).json({ message: 'Không tìm thấy yêu cầu đặt lịch' });
      }
      
      // Nếu người dùng bình thường, kiểm tra quyền truy cập
      if (req.user.role === 'user' && bookingRequest.user_id !== req.user.id) {
        return res.status(403).json({ message: 'Bạn không có quyền xem thông tin này' });
      }
      
      return res.status(200).json(bookingRequest);
    } catch (error) {
      console.error('Error getting booking request with assignments:', error);
      return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin chi tiết' });
    }
  };
  