const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { User, Role, RefreshToken, Doctor } = require('../models');

// Google Callback
exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;

    // Tìm và gán role mặc định cho người dùng
    const roleUser = await Role.findOne({ where: { code: 'ROLE_USER' } });
    if (!roleUser) {
      return res.status(500).json({ message: 'Default role not found' });
    }

    const userWithRoles = await user.getRoles();
    const hasRole = userWithRoles.some(role => role.code === 'ROLE_USER');
    if (!hasRole) {
      await user.addRole(roleUser);
    }

    // Kiểm tra và tạo refresh token
    let refreshToken = await RefreshToken.findOne({ where: { user_id: user.id } });
    if (!refreshToken) {
      refreshToken = await RefreshToken.create({
        user_id: user.id,
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '10d' }),
        expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)  // Hết hạn sau 10 ngày
      });
    } else {
      if (new Date() > new Date(refreshToken.expires_at)) {
        refreshToken.token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '10d' });
        refreshToken.expires_at = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
        await refreshToken.save();
      }
    }

    // Tạo access token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Lưu tokens vào cookie HTTP-only
    // res.cookie('accessToken', accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',  // Chỉ gửi qua HTTPS trong môi trường production
    //   sameSite: 'Strict',  // Ngăn chặn CSRF
    //   maxAge: 24 * 60 * 60 * 1000  // Cookie hết hạn sau 1 ngày
    // });

    // res.cookie('refreshToken', refreshToken.token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',  // Chỉ gửi qua HTTPS trong môi trường production
    //   sameSite: 'Strict',  // Ngăn chặn CSRF
    //   maxAge: 10 * 24 * 60 * 60 * 1000  // Cookie hết hạn sau 10 ngày
    // });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000
    });

    // Redirect về frontend
    const frontendURL = process.env.MAIN_FRONTEND_URL;
    return res.redirect(`${frontendURL}`);
  } catch (err) {
    console.error('Google callback error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng theo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kiểm tra mật khẩu
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Kiểm tra vai trò người dùng
    const roles = await user.getRoles();
    const hasValidRole = roles.some(role => ['ROLE_ADMIN', 'ROLE_PHARMACIST', 'ROLE_DOCTOR'].includes(role.code));
    if (!hasValidRole) {
      return res.status(403).json({ message: 'User does not have valid role' });
    }

    // Tạo mã xác minh và lưu vào DB hoặc Redis
    const verifyCode = Math.floor(100000 + Math.random() * 900000); // Mã xác minh 6 chữ số
    const verifyExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // Mã hết hạn sau 5 phút

    await user.update({ verify_code: verifyCode, verify_code_expires_at: verifyExpiresAt });

    // Gửi mã xác minh qua email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verification Code',
      html: `
        <p>Your verification code is: <strong>${verifyCode}</strong></p>
        <p>Please click the link below to verify your account:</p>
         <a href="${process.env.FRONTEND_URL}/verify?code=${verifyCode}">Verify your account</a>
      `,
    };


    await transporter.sendMail(mailOptions);

    // Trả về phản hồi yêu cầu nhập mã xác minh
    return res.json({ email, message: 'Verification code has been sent to your email' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Resend code

exports.resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Tìm người dùng
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // (Optional) Kiểm tra role nếu cần giống login
    const roles = await user.getRoles();
    const hasValidRole = roles.some(role => ['ROLE_ADMIN', 'ROLE_PHARMACIST', 'ROLE_DOCTOR'].includes(role.code));
    if (!hasValidRole) {
      return res.status(403).json({ message: 'User does not have valid role' });
    }

    // Tạo mã xác minh mới
    const verifyCode = Math.floor(100000 + Math.random() * 900000);
    const verifyExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    await user.update({ verify_code: verifyCode, verify_code_expires_at: verifyExpiresAt });

    // Gửi email chứa mã và link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your New Verification Code',
      html: `
        <p>Your new verification code is: <strong>${verifyCode}</strong></p>
        <p>Click the link below to enter your code and verify:</p>
        <a href="${process.env.FRONTEND_URL}/verify?email=${encodeURIComponent(user.email)}&code=${verifyCode}">Verify your account</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json(email, { message: 'Verification code resent successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify code
exports.verifyCode = async (req, res) => {
  try {
    const { email, verifyCode } = req.body;

    // Tìm người dùng theo email

    const user = await User.findOne({ where: { email } });
    const roles = await user.getRoles();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hasValidRole = roles.some(role =>
      ['ROLE_ADMIN', 'ROLE_PHARMACIST', 'ROLE_DOCTOR'].includes(role.code)
    );
    if (!hasValidRole) {
      return res.status(403).json({ message: 'User does not have valid role' });
    }
    // Kiểm tra mã xác minh và thời gian hết hạn
    if (user.verify_code !== parseInt(verifyCode)) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (new Date() > new Date(user.verify_code_expires_at)) {
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    // Tạo access token và refresh token
    const accessAdminToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const refreshAdminToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '10d' }
    );

    // Lưu refresh token vào cơ sở dữ liệu
    await RefreshToken.create({
      user_id: user.id,
      token: refreshAdminToken,
      expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 ngày
    });

    // Lưu tokens vào cookie HTTP-only
    // res.cookie('accessAdminToken', accessAdminToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',  // Chỉ gửi qua HTTPS trong môi trường production
    //   sameSite: 'Strict',  // Ngăn chặn CSRF
    //   maxAge: 24 * 60 * 60 * 1000  // Cookie hết hạn sau 1 ngày
    // });

    // res.cookie('refreshAdminToken', refreshAdminToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',  // Chỉ gửi qua HTTPS trong môi trường production
    //   sameSite: 'Strict',  // Ngăn chặn CSRF
    //   maxAge: 10 * 24 * 60 * 60 * 1000  // Cookie hết hạn sau 10 ngày
    // });
    res.cookie('accessAdminToken', accessAdminToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie('refreshAdminToken', refreshAdminToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000
    });


    // Trả về token
    const roleCodes = roles.map(role => role.code);

    res.status(200).json({
      message: 'Verification successful',
      roles: roleCodes
    });

    // Xóa mã xác minh sau khi xác minh thành công
    await user.update({ verify_code: null, verify_code_expires_at: null });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, roleCode, doctorData } = req.body;

    // Kiểm tra role được phép tạo
    const allowedRoles = ['ROLE_ADMIN', 'ROLE_PHARMACIST', 'ROLE_DOCTOR'];
    if (!allowedRoles.includes(roleCode)) {
      return res.status(400).json({ message: 'Invalid role for registration' });
    }

    // Nếu là ROLE_DOCTOR, kiểm tra doctorData có được cung cấp không
    if (roleCode === 'ROLE_DOCTOR' && !doctorData) {
      return res.status(400).json({
        message: 'doctorData is required when registering as doctor'
      });
    }

    // Nếu là ROLE_DOCTOR, validate doctorData
    if (roleCode === 'ROLE_DOCTOR') {
      const requiredDoctorFields = ['name', 'type', 'department_id'];
      const missingDoctorFields = requiredDoctorFields.filter(field => !doctorData[field]);
      if (missingDoctorFields.length > 0) {
        return res.status(400).json({
          message: `Missing required fields in doctorData: ${missingDoctorFields.join(', ')}`,
          received: doctorData
        });
      }
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Gán role tương ứng
    const role = await Role.findOne({ where: { code: roleCode } });
    if (!role) {
      await user.destroy(); // Rollback user creation if role not found
      return res.status(500).json({ message: 'Role not found in system' });
    }
    await user.addRole(role);

    let responseData = {
      message: 'User registered successfully',
      userId: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleCode
      }
    };

    // Nếu là ROLE_DOCTOR, tạo doctor profile
    if (roleCode === 'ROLE_DOCTOR') {
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

      responseData.doctor = doctor;
      responseData.message = 'Doctor registered successfully';
    }

    res.status(201).json(responseData);
  } catch (error) {
    console.error('Register error:', error);

    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: "Validation Error",
        details: error.errors.map(e => ({
          field: e.path,
          message: e.message,
          value: e.value
        }))
      });
    }

    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: "Unique Constraint Error",
        details: error.errors.map(e => ({
          field: e.path,
          message: e.message,
          value: e.value
        }))
      });
    }

    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Refresh token
exports.refreshToken = async (req, res) => {

  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const tokenInDb = await RefreshToken.findOne({
      where: {
        token: refreshToken,
        user_id: decoded.id
      }
    });

    if (!tokenInDb) {
      return res.status(403).json({ message: 'Refresh token invalid or already revoked' });
    }
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    // Lưu tokens vào cookie HTTP-only
    res.cookie('accessToken', newAccessToken, {
      // httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',  // Chỉ gửi qua HTTPS trong môi trường production
      // sameSite: 'Strict',  // Ngăn chặn CSRF
      // maxAge: 24 * 60 * 60 * 1000  // Cookie hết hạn sau 1 ngày
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000
    });
    return res.sendStatus(200);
  } catch (err) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: false, // nếu dùng HTTPS thì để true
      sameSite: 'lax'
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    });
    await RefreshToken.destroy({
      where: {
        user_id: req.user.id
      }
    });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


