const express = require('express');
const router = express.Router();
const medicalRecord = require('../controllers/medical_record.controller');
const { check } = require('express-validator');
const {authenticateToken, authenticateAdminToken} = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');


router.get('/doctor-record', authenticateAdminToken, requireRole("ROLE_DOCTOR"), medicalRecord.getDoctorMedicalRecords);

router.post('/create', authenticateAdminToken, requireRole("ROLE_DOCTOR"), medicalRecord.createMedicalRecord);

module.exports = router;