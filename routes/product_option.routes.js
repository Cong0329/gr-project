const express = require('express');
const router = express.Router();
const productOptionController = require('../controllers/product_option.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validateProductOption = require('../middlewares/validateProductOption.middleware');

router.post('/', authenticateToken, requireRole('ROLE_ADMIN'), productOptionController.addProductOption);
router.patch('/:id', authenticateToken, requireRole('ROLE_ADMIN'), validateProductOption, productOptionController.updateProductOption);
router.delete('/:id', authenticateToken, requireRole('ROLE_ADMIN'), productOptionController.deleteOption);



module.exports = router;