router.post('/:itemId/package/:packageId', 
    authenticateToken, 
    requireRole('ROLE_ADMIN'),
    validateRequest(packageItemSchema),
    itemController.addItemToPackage
  );
  
  router.delete('/:itemId/package/:packageId', 
    authenticateToken, 
    requireRole('ROLE_ADMIN'),
    itemController.removeItemFromPackage
  );
    
  // File: routes/index.js
  const express = require('express');
  const router = express.Router();
  
  const categoryRoutes = require('./service-category.routes');
  const packageRoutes = require('./service-package.routes');
  const itemRoutes = require('./service-item.routes');
  
  router.use('/categories', categoryRoutes);
  router.use('/packages', packageRoutes);
  router.use('/items', itemRoutes);
  
  module.exports = router;