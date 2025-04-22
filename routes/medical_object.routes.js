const express = require('express');
const router = express.Router();
const medicalObjectController = require('../controllers/medical_object.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.post('/', authenticateToken, requireRole('ROLE_ADMIN'), medicalObjectController.createMedicalObject);
router.get('/', medicalObjectController.getAllMedicalObjects);
router.get('/:name', medicalObjectController.getProductsByMedicalObjectName);
router.put('/:id', authenticateToken, requireRole('ROLE_ADMIN'), medicalObjectController.updateMedicalObject);
router.delete('/:id', authenticateToken, requireRole('ROLE_ADMIN'), medicalObjectController.deleteMedicalObject);

module.exports = router;
