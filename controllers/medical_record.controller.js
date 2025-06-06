const { MedicalRecord, Doctor, User, Schedule } = require('../models');

exports.getDoctorMedicalRecords = async (req, res) => {
  try {
    const userId = req.user.id;

    const doctor = await Doctor.findOne({
      where: { user_id: userId }
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bác sĩ tương ứng với tài khoản người dùng.'
      });
    }

    const doctorId = doctor.id;
    console.log('Doctor ID:', doctorId);

    const medicalRecords = await MedicalRecord.findAll({
      where: { doctor_id: doctorId },
      include: [
        {
          model: User,
          as: 'mr_user',
          attributes: ['id', 'name', 'email', 'phone', 'avatar_url']
        },
        {
          model: Schedule,
          as: 'mr_schedule'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log('Found medical records:', medicalRecords.length);

    res.status(200).json({
      success: true,
      data: medicalRecords
    });

  } catch (error) {
    console.error('Error fetching doctor medical records:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy hồ sơ bệnh án',
      error: error.message
    });
  }
};

exports.createMedicalRecord = async (req, res) => {
  try {
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

    const {
      user_id,     
      schedule_id,  
      diagnosis,    
      treatment      
    } = req.body;

    if (!user_id || !schedule_id || !diagnosis || !treatment) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin hồ sơ bệnh án.'
      });
    }

    const newRecord = await MedicalRecord.create({
      user_id,
      doctor_id: doctorId,
      schedule_id,
      diagnosis,
      treatment
    });

    res.status(201).json({
      success: true,
      message: 'Tạo hồ sơ bệnh án thành công.',
      data: newRecord
    });

  } catch (error) {
    console.error('Lỗi tạo hồ sơ bệnh án:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi tạo hồ sơ bệnh án.',
      error: error.message
    });
  }
};
