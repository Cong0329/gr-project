const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.post('/', authenticateToken, requireRole('ROLE_ADMIN'), categoryController.createCategory);
router.get('/', categoryController.getAllCategorys);
router.put('/:id', authenticateToken, requireRole('ROLE_ADMIN'), categoryController.updateCategory);
router.delete('/:id', authenticateToken, requireRole('ROLE_ADMIN'), categoryController.deleteCategory);

module.exports = router;