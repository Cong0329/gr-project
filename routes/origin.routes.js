const express = require('express');
const router = express.Router();
const originController = require('../controllers/origin.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.post('/', authenticateToken, requireRole('ROLE_ADMIN'), originController.createOrigin);
router.get('/', originController.getAllOrigins);
router.get('/:name', originController.getProductsByOriginName);
router.put('/:id', authenticateToken, requireRole('ROLE_ADMIN'), originController.updateOrigin);
router.delete('/:id', authenticateToken, requireRole('ROLE_ADMIN'), originController.deleteOrigin);

module.exports = router;
