const express = require('express');
const router = express.Router();
const Joi = require('joi');
const itemController = require('../controllers/service_item.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validateRequest = require('../middlewares/validateRequest.middleware');

// Validation schema
const itemSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('', null),
  duration: Joi.number().integer().allow(null),
  price: Joi.number().allow(null),
  categoryId: Joi.number().integer().required()
});

const packageItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).default(1)
});

// Public routes
router.get('/', itemController.getAllItems);
router.get('/category/:categoryId', itemController.getItemsByCategory);
router.get('/package/:packageId', itemController.getItemsByPackage);
router.get('/:id', itemController.getItemById);

// Protected routes
router.post('/', 
  authenticateToken, 
  requireRole('ROLE_ADMIN'),
  validateRequest(itemSchema),
  itemController.createItem
);

router.put('/:id', 
  authenticateToken, 
  requireRole('ROLE_ADMIN'),
  validateRequest(itemSchema),
  itemController.updateItem
);

router.delete('/:id', 
  authenticateToken, 
  requireRole('ROLE_ADMIN'),
  itemController.deleteItem
);
module.exports = router;