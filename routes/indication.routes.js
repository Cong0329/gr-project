const express = require('express');
const router = express.Router();
const indicationController = require('../controllers/indication.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.post('/', authenticateToken, requireRole('ROLE_ADMIN'), indicationController.createIndication);
router.get('/', indicationController.getAllIndications);
router.put('/:id', authenticateToken, requireRole('ROLE_ADMIN'), indicationController.updateIndication);
router.delete('/:id', authenticateToken, requireRole('ROLE_ADMIN'), indicationController.deleteIndication);

module.exports = router;
