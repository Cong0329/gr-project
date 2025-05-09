// services/bookingService.js
const { PackageBookingRequest, ServicePackage, User, Doctor, Schedule, DoctorAssignment } = require('../models');
const { Op } = require('sequelize');

class BookingService {
  // Tạo một booking request mới
  async createBookingRequest(data) {
    const { user_id, package_type, package_id, requested_date, requested_time_slot, notes } = data;
    
    // Kiểm tra gói dịch vụ tồn tại
    const servicePackage = await ServicePackage.findByPk(package_id);
    if (!servicePackage) {
      throw new Error('Không tìm thấy gói dịch vụ');
    }
    
    // Kiểm tra loại gói dịch vụ phù hợp
    if (servicePackage.type !== package_type) {
      throw new Error('Loại gói dịch vụ không khớp');
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
    
    return bookingRequest;
  }
  
  // Bác sĩ yêu cầu nhận booking request
  async requestAssignment(doctorId, bookingRequestId, notes = null) {
    // Kiểm tra booking request tồn tại và đang ở trạng thái pending
    const bookingRequest = await PackageBookingRequest.findOne({
      where: {
        id: bookingRequestId,
        status: 'pending'
      }
    });
    
    if (!bookingRequest) {
      throw new Error('Không tìm thấy yêu cầu đặt lịch hợp lệ');
    }
    
    // Kiểm tra bác sĩ tồn tại
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      throw new Error('Không tìm thấy bác sĩ');
    }
    
    // Kiểm tra xem bác sĩ đã yêu cầu nhận booking này chưa
    const existingAssignment = await DoctorAssignment.findOne({
      where: {
        booking_request_id: bookingRequestId,
        doctor_id: doctorId
      }
    });
    
    if (existingAssignment) {
      throw new Error('Bác sĩ đã yêu cầu nhận lịch này trước đó');
    }
    
    // Tạo doctor assignment
    const assignment = await DoctorAssignment.create({
      booking_request_id: bookingRequestId,
      doctor_id: doctorId,
      status: 'requested',
      notes
    });
    
    // Hook trong model DoctorAssignment sẽ tự động cập nhật status của booking request
    
    return assignment;
  }
  
  // Admin phê duyệt yêu cầu của bác sĩ
  async approveAssignment(assignmentId) {
    const assignment = await DoctorAssignment.findByPk(assignmentId, {
      include: [
        { association: 'bookingRequest' }
      ]
    });
    
    if (!assignment) {
      throw new Error('Không tìm thấy yêu cầu phân công');
    }
    
    if (assignment.status !== 'requested') {
      throw new Error('Yêu cầu phân công này không ở trạng thái chờ phê duyệt');
    }
    
    // Cập nhật trạng thái assignment
    await assignment.update({ status: 'approved' });
    
    return assignment;
  }
  
  // Tạo lịch từ assignment đã được phê duyệt
  async createScheduleFromAssignment(assignmentId, startTime, endTime) {
    const assignment = await DoctorAssignment.findByPk(assignmentId, {
      include: [
        { association: 'bookingRequest' }
      ]
    });
    
    if (!assignment) {
      throw new Error('Không tìm thấy yêu cầu phân công');
    }
    
    if (assignment.status !== 'approved') {
      throw new Error('Yêu cầu phân công chưa được phê duyệt');
    }
    
    const bookingRequest = assignment.bookingRequest;
    
    if (bookingRequest.schedule_id) {
      throw new Error('Yêu cầu đặt lịch này đã được gán lịch');
    }
    
    // Tạo lịch mới
    const schedule = await Schedule.create({
      doctor_id: assignment.doctor_id,
      date: bookingRequest.requested_date,
      start_time: startTime,
      end_time: endTime,
      status: 'booked',
      type: bookingRequest.package_type, // general hoặc medical
      service_id: bookingRequest.package_id // Đây là điểm quan trọng - gán package_id vào service_id
    });
    
    // Cập nhật booking request
    await bookingRequest.update({
      schedule_id: schedule.id,
      status: 'assigned'
    });
    
    return {
      assignment,
      schedule,
      bookingRequest: await PackageBookingRequest.findByPk(bookingRequest.id, {
        include: [
          { association: 'package' },
          { association: 'user' },
          { 
            association: 'schedule',
            include: [{ association: 'doctor' }]
          }
        ]
      })
    };
  }
  
  // Phương thức để lấy các booking request đang chờ xử lý
  async getPendingBookings() {
    return PackageBookingRequest.findAll({
      where: {
        status: 'pending'
      },
      include: [
        { association: 'package' },
        { association: 'user' }
      ],
      order: [['created_at', 'ASC']]
    });
  }
  
  // Phương thức để lấy các booking request được yêu cầu bởi bác sĩ
  async getDoctorRequestedBookings() {
    return PackageBookingRequest.findAll({
      where: {
        status: 'doctor_requested'
      },
      include: [
        { association: 'package' },
        { association: 'user' },
        { 
          association: 'doctorAssignments',
          include: [{ association: 'doctor' }]
        }
      ],
      order: [['created_at', 'ASC']]
    });
  }
  
  // Phương thức để lấy các yêu cầu phân công của một bác sĩ
  async getDoctorAssignments(doctorId, status = null) {
    const whereClause = {
      doctor_id: doctorId
    };
    
    if (status) {
      whereClause.status = status;
    }
    
    return DoctorAssignment.findAll({
      where: whereClause,
      include: [
        { 
          association: 'bookingRequest',
          include: [
            { association: 'package' },
            { association: 'user' }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });
  }
  
  // Phương thức để lấy lịch khám của bác sĩ
  async getDoctorSchedules(doctorId, date) {
    const whereClause = {
      doctor_id: doctorId
    };
    
    if (date) {
      whereClause.date = date;
    }
    
    return Schedule.findAll({
      where: whereClause,
      order: [
        ['date', 'ASC'],
        ['start_time', 'ASC']
      ]
    });
  }
  
  // Phương thức để lấy chi tiết lịch với thông tin dịch vụ
  async getScheduleWithServiceDetails(scheduleId) {
    const schedule = await Schedule.findByPk(scheduleId, {
      include: [
        { association: 'doctor' }
      ]
    });
    
    if (!schedule) {
      throw new Error('Không tìm thấy lịch');
    }
    
    // Lấy thông tin dịch vụ tương ứng (đây là điểm bạn gặp lỗi)
    const service = await schedule.getService();
    
    // Lấy thông tin booking request liên quan (nếu có)
    const bookingRequest = await PackageBookingRequest.findOne({
      where: { schedule_id: scheduleId },
      include: [{ association: 'user' }]
    });
    
    return {
      schedule,
      service,
      bookingRequest
    };
  }
  
  // Phương thức để hủy booking request
  async cancelBookingRequest(bookingRequestId) {
    const bookingRequest = await PackageBookingRequest.findByPk(bookingRequestId);
    if (!bookingRequest) {
      throw new Error('Không tìm thấy yêu cầu đặt lịch');
    }
    
    // Nếu đã có lịch, cần hủy lịch
    if (bookingRequest.schedule_id) {
      const schedule = await Schedule.findByPk(bookingRequest.schedule_id);
      if (schedule) {
        await schedule.update({ status: 'cancelled' });
      }
    }
    
    // Hủy tất cả các doctor assignment liên quan
    await DoctorAssignment.update(
      { status: 'rejected' },
      { where: { booking_request_id: bookingRequestId, status: 'requested' } }
    );
    
    // Cập nhật trạng thái booking request
    await bookingRequest.update({ status: 'cancelled' });
    
    return bookingRequest;
  }
}

module.exports = new BookingService();