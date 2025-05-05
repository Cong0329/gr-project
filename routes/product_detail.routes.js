const express = require('express');
const router = express.Router();
const productDetailController = require('../controllers/product_detail.controller');
const {authenticateAdminToken} = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.post('/', authenticateAdminToken, requireRole('ROLE_ADMIN'), productDetailController.createProductDetail);
router.get('/:product_id', productDetailController.getProductDetailByProductId);
router.patch('/:id', authenticateAdminToken, requireRole('ROLE_ADMIN'), productDetailController.updateProductDetail);
router.delete('/:id', authenticateAdminToken, requireRole('ROLE_ADMIN'), productDetailController.deleteProductDetail);

module.exports = router;