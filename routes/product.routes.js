const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validatePatchProduct = require('../middlewares/validateProduct.middleware');

router.post('/', authenticateToken, requireRole('ROLE_ADMIN'), productController.createProduct);
router.get('/:slug', productController.getProductBySlug);
router.get('/', productController.getAllProducts);
router.patch('/:id', authenticateToken, requireRole('ROLE_ADMIN'), validatePatchProduct, productController.updateProduct);
router.delete('/:id', authenticateToken, requireRole('ROLE_ADMIN'), productController.deleteProduct);

module.exports = router;
