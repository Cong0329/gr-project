const express = require('express');
const router = express.Router();
const Joi = require('joi');
const categoryController = require('../controllers/service-category.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validateRequest = require('../middlewares/validateRequest.middleware');

// Validation schema
const categorySchema = Joi.object({
  name: Joi.string().required(),
  parentId: Joi.number().integer().allow(null)
});

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/parent/:parentId', categoryController.getCategoriesByParent);
router.get('/:id', categoryController.getCategoryById);

// Protected routes
router.post('/', 
  authenticateToken, 
  requireRole('ROLE_ADMIN'),
  validateRequest(categorySchema),
  categoryController.createCategory
);

router.put('/:id', 
  authenticateToken, 
  requireRole('ROLE_ADMIN'),
  validateRequest(categorySchema),
  categoryController.updateCategory
);

router.delete('/:id', 
  authenticateToken, 
  requireRole('ROLE_ADMIN'),
  categoryController.deleteCategory
);

module.exports = router;