const express = require('express');
const router = express.Router();
const productDetailController = require('../controllers/product_detail.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.post('/', authenticateToken, requireRole('ROLE_ADMIN'), productDetailController.createProductDetail);
router.get('/:product_id', productDetailController.getProductDetailByProductId);
router.patch('/:id', authenticateToken, requireRole('ROLE_ADMIN'), productDetailController.updateProductDetail);
router.delete('/:id', authenticateToken, requireRole('ROLE_ADMIN'), productDetailController.deleteProductDetail);

module.exports = router;