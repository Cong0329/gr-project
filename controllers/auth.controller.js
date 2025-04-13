const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { User, Role, RefreshToken } = require('../models');

// Google Callback
exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;

    // Tìm role mặc định
    const roleUser = await Role.findOne({ where: { code: 'ROLE_USER' } });
    if (!roleUser) {
      return res.status(500).json({ message: 'Default role not found' });
    }

    // Gán role cho user nếu chưa có
    const userWithRoles = await user.getRoles();
    const hasRole = userWithRoles.some(role => role.code === 'ROLE_USER');
    if (!hasRole) {
      await user.addRole(roleUser);
    }

    // Kiểm tra xem refresh token đã tồn tại trong DB chưa
    let refreshToken = await RefreshToken.findOne({ where: { user_id: user.id } });

    if (!refreshToken) {
      // Nếu không có refresh token, tạo mới
      refreshToken = await RefreshToken.create({
        user_id: user.id,
        token: jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET,
          { expiresIn: '10d' }
        ),
        expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 ngày
      });
    } else {
      // Nếu có refresh token, kiểm tra xem nó có hết hạn không
      if (new Date() > new Date(refreshToken.expires_at)) {
        // Nếu refresh token hết hạn, cập nhật lại token mới
        refreshToken.token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET,
          { expiresIn: '10d' }
        );
        refreshToken.expires_at = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 ngày
        await refreshToken.save();
      }
    }

    // Tạo access token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ accessToken, refreshToken: refreshToken.token });
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
    const hasValidRole = roles.some(role => ['ROLE_ADMIN', 'ROLE_PHARMACIST'].includes(role.code));
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
      text: `Your verification code is: ${verifyCode}`,
    };

    await transporter.sendMail(mailOptions);

    // Trả về phản hồi yêu cầu nhập mã xác minh
    res.json({ message: 'Verification code sent to email' });

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
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Kiểm tra mã xác minh và thời gian hết hạn
    if (user.verify_code !== parseInt(verifyCode)) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (new Date() > new Date(user.verify_code_expires_at)) {
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    // Tạo access token và refresh token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '10d' }
    );

    // Lưu refresh token vào cơ sở dữ liệu
    await RefreshToken.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 ngày
    });

    // Trả về token
    res.json({ accessToken, refreshToken });

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
    const { name, email, password, roleCode } = req.body;

    // Kiểm tra role được phép tạo
    const allowedRoles = ['ROLE_ADMIN', 'ROLE_PHARMACIST'];
    if (!allowedRoles.includes(roleCode)) {
      return res.status(400).json({ message: 'Invalid role for registration' });
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
      return res.status(500).json({ message: 'Role not found in system' });
    }
    await user.addRole(role);

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Refresh token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

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

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

// Logout
exports.logout = async(req, res) => {
  try {
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


