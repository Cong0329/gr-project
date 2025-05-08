const express = require('express');
const router = express.Router();
const {authenticateToken, authenticateAdminToken} = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const userController = require('../controllers/user.controller');

// Lấy profile người dùng hiện tại
router.get('/me', authenticateToken, userController.getProfile);

// Cập nhật thông tin cá nhân
router.put('/me', authenticateToken, userController.updateProfile);

router.get('/admin/me', authenticateAdminToken, userController.getProfile);

// Lấy danh sách tất cả user (chỉ admin)
router.get('/users', authenticateToken, requireRole('ROLE_ADMIN'), userController.getAllUsers);

module.exports = router;
