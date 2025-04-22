const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment_method.controller');
require('dotenv').config();
const moment = require('moment');

router.get('/vnpay-return', paymentController.vnpayReturn);



module.exports = router;