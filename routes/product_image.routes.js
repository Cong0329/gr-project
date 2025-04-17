const express = require('express');
const router = express.Router();
const productImageController = require('../controllers/product_image.controller');
const upload = require('../middlewares/upload.middleware');
const requireRole = require('../middlewares/role.middleware');
const authenticateToken = require('../middlewares/auth.middleware');

// POST /api/v1/product-images
router.post('/',authenticateToken, requireRole('ROLE_ADMIN'), upload.array('images'), productImageController.addProductImages);
router.delete('/:id',authenticateToken, requireRole('ROLE_ADMIN'), productImageController.deleteProductImage);

module.exports = router;
