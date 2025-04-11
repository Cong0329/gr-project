// routes/user.route.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');
const { User } = require('../models/user.model');

// Get user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'avatar_url', 'phone', 'gender'] // chọn thông tin cần trả
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all users
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['provider_id', 'created_by', 'updated_by', 'deleted_by', 'provider', 'created_at', 'updated_at', 'deleted_at'] } 
    });
    res.json(users);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit user
router.put('/me', authenticateToken, async (req, res) => {
  const { name, phone, gender } = req.body;
  const userId = req.user.id; 

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (gender !== undefined) user.gender = gender;
    user.updated_at = new Date();

    await user.save();
    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        gender: user.gender,
      },
    });    
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
