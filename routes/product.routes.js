const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const {authenticateAdminToken} = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validatePatchProduct = require('../middlewares/validateProduct.middleware');

router.post('/', authenticateAdminToken, requireRole('ROLE_ADMIN'), productController.createProduct);
router.get('/:slug', productController.getProductBySlug);
router.get('/', productController.getAllProducts);
router.get('/id/:id', productController.getProductById);
router.get('/search/:name', productController.searchProductsByName);
router.patch('/:id', authenticateAdminToken, requireRole('ROLE_ADMIN'), validatePatchProduct, productController.updateProduct);
router.delete('/:id', authenticateAdminToken, requireRole('ROLE_ADMIN'), productController.deleteProduct);

module.exports = router;
