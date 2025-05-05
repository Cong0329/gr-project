const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const {authenticateToken, authenticateAdminToken} = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');


router.post('/', authenticateToken, orderController.createOrder);
router.get('/admin/all', authenticateAdminToken, requireRole('ROLE_ADMIN'), orderController.getAllOrders);
router.get('/:id/admin', authenticateAdminToken, requireRole('ROLE_ADMIN'), orderController.getOrderById);
router.get('/:id/me', authenticateToken, orderController.getOrderById);
router.patch('/:id/admin/confirm', authenticateAdminToken, requireRole('ROLE_ADMIN'), orderController.confirmOrder);
router.patch('/:id/admin/shipping', authenticateAdminToken, requireRole('ROLE_ADMIN'), orderController.shippingOrder);
router.patch('/:id/admin/completed', authenticateToken, orderController.completeOrder);
router.get('/me', authenticateToken,  orderController.getUserOrders);
router.put('/me/:id/cancel', authenticateToken, orderController.cancelOrder);

module.exports = router;