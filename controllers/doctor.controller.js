const { Doctor, User, Role, Department  } = require("../models");
const bcrypt = require('bcrypt');

// Hàm tạo user và doctor profile liên kết
exports.createDoctor = async (req, res) => {
  try {
    const body = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    for (const entry of body) {
      console.log("Entry data:", JSON.stringify(entry, null, 2));

      const { userData, doctorData } = entry;

      // Validate required fields
      if (!userData || !doctorData) {
        return res.status(400).json({ 
          error: "Both userData and doctorData are required",
          received: entry
        });
      }

      // Validate userData
      const requiredUserFields = ['name', 'email', 'password', 'phone', 'gender'];
      const missingUserFields = requiredUserFields.filter(field => !userData[field]);
      if (missingUserFields.length > 0) {
        return res.status(400).json({ 
          error: `Missing required fields in userData: ${missingUserFields.join(', ')}`,
          received: userData
        });
      }

      // Validate doctorData
      const requiredDoctorFields = ['name', 'type', 'department_id'];
      const missingDoctorFields = requiredDoctorFields.filter(field => !doctorData[field]);
      if (missingDoctorFields.length > 0) {
        return res.status(400).json({ 
          error: `Missing required fields in doctorData: ${missingDoctorFields.join(', ')}`,
          received: doctorData
        });
      }

      // Check if email already exists
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (existingUser) {
        return res.status(400).json({ 
          error: "Email already registered",
          email: userData.email
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user with doctor role
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone,
        gender: userData.gender,
      });

      // Assign doctor role
      const doctorRole = await Role.findOne({ where: { code: 'ROLE_DOCTOR' } });
      if (!doctorRole) {
        await user.destroy(); // Rollback user creation if role not found
        return res.status(500).json({ 
          error: "Doctor role not found in system"
        });
      }
      await user.addRole(doctorRole);

      // Create doctor profile with all new fields
      const doctor = await Doctor.create({
        name: doctorData.name,
        type: doctorData.type,
        department_id: doctorData.department_id,
        experience: doctorData.experience,
        position: doctorData.position,
        avatar: doctorData.avatar,
        patientAge: doctorData.patientAge,
        location: doctorData.location,
        clinic: doctorData.clinic,
        address: doctorData.address,
        user_id: user.id,
      });

      results.push({ 
        user: { 
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          gender: user.gender
        },
        doctor 
      });
    }

    res.status(201).json({
      success: true,
      message: `Created ${results.length} doctor(s) successfully`,
      data: results
    });

  } catch (err) {
    console.error("Error creating doctor:", err);
    
    // Handle validation errors
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: "Validation Error",
        details: err.errors.map(e => ({
          field: e.path,
          message: e.message,
          value: e.value
        }))
      });
    }

    // Handle unique constraint errors
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        error: "Unique Constraint Error",
        details: err.errors.map(e => ({
          field: e.path,
          message: e.message,
          value: e.value
        }))
      });
    }

    // Handle other errors
    res.status(500).json({ 
      error: "Internal server error when creating doctor",
      message: err.message
    });
  }
};


// Lấy danh sách tất cả doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json(doctors);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách bác sĩ:", err);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách bác sĩ" });
  }
};

// Lấy thông tin chi tiết 1 doctor
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: "Không tìm thấy bác sĩ" });
    }
    res.json(doctor);
  } catch (err) {
    console.error("Lỗi khi lấy bác sĩ theo ID:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Cập nhật thông tin doctor
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: "Không tìm thấy bác sĩ" });
    }

    await doctor.update(req.body);
    res.json(doctor);
  } catch (err) {
    console.error("Lỗi khi cập nhật bác sĩ:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Xóa doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: "Không tìm thấy bác sĩ" });
    }

    await doctor.destroy();
    res.json({ message: "Xoá bác sĩ thành công" });
  } catch (err) {
    console.error("Lỗi khi xoá bác sĩ:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

exports.getDoctorInfo = async (req, res, next) => {
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
    console.log('Doctor found:', doctor);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found for this user'
      });
    }

    res.json({
      success: true,
      data: {
        id: doctor.id,
        name: doctor.name,
        avatar: doctor.avatar,
        position: doctor.position,
        type: doctor.type,
        experience: doctor.experience,
        address: doctor.address,
        department: doctor.department
      }
    });

  } catch (error) {
    console.error('Error in getDoctorInfo:', error);
    next(error);
  }
};
