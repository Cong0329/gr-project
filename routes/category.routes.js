const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const {authenticateAdminToken} = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.post('/', authenticateAdminToken, requireRole('ROLE_ADMIN'), categoryController.createCategory);
router.get('/', categoryController.getAllCategorys);
router.get('/parent', categoryController.getParentCategorys);
router.get('/:name', categoryController.getProductsByCategoryName);
router.put('/:id', authenticateAdminToken, requireRole('ROLE_ADMIN'), categoryController.updateCategory);
router.delete('/:id', authenticateAdminToken, requireRole('ROLE_ADMIN'), categoryController.deleteCategory);

module.exports = router;