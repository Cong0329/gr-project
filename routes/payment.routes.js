const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment_method.controller');
require('dotenv').config();
const moment = require('moment');

router.get('/vnpay-return', paymentController.vnpayReturn);
router.get('/apointment-vnpay-return/', paymentController.vnpayReturnApointment);
router.get('/package-vnpay-return/', paymentController.vnpayReturnPackage);
router.get('/', paymentController.getAllPaymentMethods);



module.exports = router;