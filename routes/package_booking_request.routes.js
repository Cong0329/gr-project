const express = require('express');
const router = express.Router();
const bookingRequestController = require('../controllers/package_booking.controller');
const {authenticateToken} = require('../middlewares/auth.middleware');


// Chỉ người dùng đã đăng nhập mới có thể tạo
router.post(
  '/', 
  bookingRequestController.createBookingRequest
);

// Route để lấy chi tiết của một yêu cầu đặt lịch
// Chỉ người dùng đã đăng nhập mới có thể truy cập
router.get(
  '/:id', 
  bookingRequestController.getBookingRequestDetails
);

// Route để gán lịch cho một yêu cầu đặt lịch
// Chỉ admin và staff mới có thể thực hiện chức năng này
router.post(
  '/assign-schedule', 
  bookingRequestController.assignSchedule
);

// Route để lấy tất cả các yêu cầu đặt lịch
// Chỉ admin và staff mới có thể truy cập
// Bạn cần thêm hàm này vào controller
router.get(
  '/a', 
  (req, res) => {
    // Placeholder cho hàm getAllBookingRequests
    res.status(501).json({ message: 'Chức năng đang được phát triển' });
  }
);

// Route để lấy tất cả các yêu cầu đặt lịch của một user
// Người dùng chỉ có thể xem yêu cầu của chính họ
router.get(
  '/user/me', authenticateToken, bookingRequestController.getUserPackageBooking
);

// Route để huỷ booking request
router.put('/:id/cancel', authenticateToken, bookingRequestController.cancelBookingRequest);

router.get(
  '/', bookingRequestController.getBookingRequests
);

module.exports = router;