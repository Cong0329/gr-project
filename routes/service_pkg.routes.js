const express = require('express');
const router = express.Router();
const Joi = require('joi');
const packageController = require('../controllers/service_pkg.controller');
const {authenticateToken} = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validateRequest = require('../middlewares/validateRequest.middleware');

// Validation schema
const packageSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().valid('general', 'medical').required(),
  description: Joi.string().allow('', null),
  price: Joi.number().required(),
  totalDuration: Joi.number().integer().allow(null),
  rating: Joi.number().allow(null),
  reviews: Joi.number().integer().allow(null),
  target: Joi.string().allow('', null),
  image: Joi.string().allow('', null),
  details: Joi.object().allow(null),
  availableLocations: Joi.array().items(Joi.string()).allow(null),
  validUntil: Joi.date().allow(null),
  categoryId: Joi.number().integer().required(),
  items: Joi.array().items(
    Joi.object({
      itemId: Joi.number().integer().required(),
      quantity: Joi.number().integer().min(1).default(1)
    })
  ).allow(null)
});

// Public routes
router.get('/', packageController.getAllPackages);
router.get('/category/:categoryId', packageController.getPackagesByCategory);
router.get('/:id', packageController.getPackageById);

// Protected routes
router.post('/', 
  authenticateToken, 
  requireRole('ROLE_ADMIN'),
  validateRequest(packageSchema),
  packageController.createPackage
);

router.put('/:id', 
  authenticateToken, 
  requireRole('ROLE_ADMIN'),
  validateRequest(packageSchema),
  packageController.updatePackage
);

router.delete('/:id', 
  authenticateToken, 
  requireRole('ROLE_ADMIN'),
  packageController.deletePackage
);

module.exports = router;