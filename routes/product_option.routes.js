const express = require('express');
const router = express.Router();
const productOptionController = require('../controllers/product_option.controller');
const {authenticateAdminToken} = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validateProductOption = require('../middlewares/validateProductOption.middleware');

router.post('/', authenticateAdminToken, requireRole('ROLE_ADMIN'), productOptionController.addProductOption);
router.get('/:product_id', productOptionController.getOptionsByProductId);
router.patch('/:id', authenticateAdminToken, requireRole('ROLE_ADMIN'), productOptionController.updateProductOption);
router.delete('/:optionId', authenticateAdminToken, requireRole('ROLE_ADMIN'), productOptionController.deleteOption);



module.exports = router;