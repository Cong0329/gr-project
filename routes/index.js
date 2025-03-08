var express = require('express');
var router = express.Router();
var sessionStrl = require('../controllers/register_controller');
var sessionCtrl = require('../controllers/login_controller');
var middwareSession = require('../Middleware/logout');
var sessionVtrl = require('../controllers/logout_controller');
var sessionHtrl = require('../controllers/hotel_controller');
const userController = require('../controllers/userController');
const {Hotel} = require('../models/hotel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/login', sessionCtrl.login); 
router.post('/register',sessionStrl.createUser);
router.get('/user', userController.getUserById);
router.put('/user', userController.updateUser);
router.get('/user/booking', userController.getUserBooking);
router.put('/user/booking', userController.updateBookingStatus);
router.post('/logout',middwareSession.authenticateToken,sessionVtrl.logout);
router.get('/hotels',sessionHtrl.getHotel);
router.post('/hotel',sessionHtrl.addHotel);
router.post('/delete/hotel',sessionHtrl.deleteHotel);
router.post('/hotels',sessionHtrl.postHotel );
router.get('/hotel/:id', sessionHtrl.getHotelId);


module.exports = router;
