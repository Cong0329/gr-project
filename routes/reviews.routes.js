const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { authenticateToken, authenticateAdminToken } = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.post('/', authenticateToken, reviewController.createReview);
router.post('/:id/reply', authenticateAdminToken, requireRole('ROLE_ADMIN'), reviewController.replyToReview);
router.put('/reply/:replyId', authenticateAdminToken, requireRole('ROLE_ADMIN'), reviewController.updateReviewReply);
router.get('/', authenticateAdminToken, requireRole('ROLE_ADMIN'), reviewController.getAllReviews);
router.get('/pending', authenticateAdminToken, requireRole('ROLE_ADMIN'), reviewController.getAllPendingReviews);
router.get('/product/:productId', reviewController.getReviewsByProduct);

module.exports = router;
