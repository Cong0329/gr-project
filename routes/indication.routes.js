const express = require('express');
const router = express.Router();
const indicationController = require('../controllers/indication.controller');
const {authenticateAdminToken} = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.post('/', authenticateAdminToken, requireRole('ROLE_ADMIN'), indicationController.createIndication);
router.get('/', indicationController.getAllIndications);
router.get('/:name', indicationController.getProductsByIndicationName);
router.put('/:id', authenticateAdminToken, requireRole('ROLE_ADMIN'), indicationController.updateIndication);
router.delete('/:id', authenticateAdminToken, requireRole('ROLE_ADMIN'), indicationController.deleteIndication);

module.exports = router;
