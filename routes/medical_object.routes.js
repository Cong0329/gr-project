const express = require('express');
const router = express.Router();
const medicalObjectController = require('../controllers/medical_object.controller');
const {authenticateAdminToken} = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.post('/', authenticateAdminToken, requireRole('ROLE_ADMIN'), medicalObjectController.createMedicalObject);
router.get('/', medicalObjectController.getAllMedicalObjects);
router.get('/:name', medicalObjectController.getProductsByMedicalObjectName);
router.put('/:id', authenticateAdminToken, requireRole('ROLE_ADMIN'), medicalObjectController.updateMedicalObject);
router.delete('/:id', authenticateAdminToken, requireRole('ROLE_ADMIN'), medicalObjectController.deleteMedicalObject);

module.exports = router;
