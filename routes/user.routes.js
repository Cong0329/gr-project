const express = require('express');
const router = express.Router();
const {authenticateToken, authenticateAdminToken} = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const userController = require('../controllers/user.controller');
const upload = require('../middlewares/upload.middleware');

// Lấy profile người dùng hiện tại
router.get('/me', authenticateToken, userController.getProfile);

// Cập nhật thông tin cá nhân
router.put('/me', authenticateToken, userController.updateProfile);

router.put('/admin/me', authenticateAdminToken, upload.single('avatar'), userController.updateProfile);

router.get('/admin/me', authenticateAdminToken, userController.getProfile);

// Lấy danh sách tất cả user (chỉ admin)
router.get('/users', authenticateAdminToken, requireRole('ROLE_ADMIN'), userController.getAllUsers);

router.put('/hide/:id', authenticateAdminToken, requireRole('ROLE_ADMIN'), userController.hideUser);

router.get('/stats/month', authenticateAdminToken, requireRole('ROLE_ADMIN'), userController.getUserStatsByMonth);

router.get("/stats/growth", authenticateAdminToken, requireRole('ROLE_ADMIN'), userController.getUserStatsWithGrowth);

module.exports = router;
