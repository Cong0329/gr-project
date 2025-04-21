const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');


router.post('/', authenticateToken, orderController.createOrder);
router.get('/', authenticateToken, requireRole('ROLE_ADMIN'), orderController.getAllOrders);
router.get('/:id', authenticateToken, requireRole('ROLE_ADMIN'), orderController.getOrderById);
router.get('/me', authenticateToken,  orderController.getUserOrders);
router.patch('/:id', authenticateToken, requireRole('ROLE_ADMIN'), orderController.updateOrderStatus);
router.put('/me/:id/cancel', authenticateToken, orderController.cancelOrder);

module.exports = router;