const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { check } = require('express-validator');
const {authenticateToken, authenticateAdminToken} = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');



// Validations
const appointmentValidation = [
  check('doctor_id').not().isEmpty().withMessage('Doctor ID is required'),
  check('date').isDate().withMessage('Valid date is required'),
  check('start_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Start time must be in format HH:MM:SS'),
  check('end_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('End time must be in format HH:MM:SS'),
  check('type').isIn(['specialist', 'specialist_online'])
    .withMessage('Type must be specialist or specialist_online'),
  check('service_id').isNumeric().withMessage('Service ID must be numeric'),
  check('payment_method').isIn(['vnpay', 'cash', 'online']).withMessage('Payment method must be cash or online')
];

// Public Routes
router.post('/create', appointmentValidation, appointmentController.createAppointment);

// Protected Routes
// Get all appointments (filtered by role)
router.get('/', appointmentController.getAppointments);

// Get appointment by ID
router.get('/:id', appointmentController.getAppointmentById);

// Update appointment status (Admin/Doctor only)
router.patch('/:id/status', 
  [check('status').isIn(['confirmed', 'cancelled', 'completed', 'rejected'])
    .withMessage('Invalid status value')],
  appointmentController.updateAppointmentStatus
);

// Cancel appointment
router.post('/:id/cancel', authenticateToken, appointmentController.cancelAppointment
);

router.get('/user/me', authenticateToken, appointmentController.getUserAppointment)

router.get('/doctor-schedule/me', authenticateAdminToken, requireRole('ROLE_DOCTOR'), appointmentController.getDoctorAppointments)

module.exports = router;