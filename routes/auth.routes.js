const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const  { Role }  = require('../models');

// Google Authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  async (req, res) => {
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
        await user.addRole(roleUser); // Sequelize auto tạo bản ghi user_roles
      }

      // Tạo token
      const accessToken = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '3d' }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '10d' }
      );

      res.json({ accessToken, refreshToken });
    } catch (err) {
      console.error('Google callback error:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// Refresh token
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
});


module.exports = router;
