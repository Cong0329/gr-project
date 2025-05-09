const express = require('express');
const router = express.Router();
const bookingRequestController = require('../controllers/package_booking.controller');

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
  '/', 
  (req, res) => {
    // Placeholder cho hàm getAllBookingRequests
    res.status(501).json({ message: 'Chức năng đang được phát triển' });
  }
);

// Route để lấy tất cả các yêu cầu đặt lịch của một user
// Người dùng chỉ có thể xem yêu cầu của chính họ
router.get(
  '/user/:userId', 
  (req, res, next) => {
    // Middleware kiểm tra người dùng chỉ truy cập dữ liệu của chính họ
    const requestedUserId = req.params.userId;
    if (req.user.role === 'user' && req.user.id !== parseInt(requestedUserId)) {
      return res.status(403).json({ message: 'Không được phép truy cập dữ liệu của người dùng khác' });
    }
    next();
  },
  (req, res) => {
    // Placeholder cho hàm getUserBookingRequests
    res.status(501).json({ message: 'Chức năng đang được phát triển' });
  }
);

// Route để huỷ booking request
router.put(
  '/:id/cancel',
  (req, res) => {
    // Placeholder cho hàm cancelBookingRequest
    res.status(501).json({ message: 'Chức năng đang được phát triển' });
  }
);



module.exports = router;