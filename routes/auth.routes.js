const express = require('express');
const passport = require('passport');
const router = express.Router();
const {authenticateToken} = require('../middlewares/auth.middleware');
const authController = require('../controllers/auth.controller');

// Google Authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'],  prompt: 'select_account' }));

// Google Callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  authController.googleCallback
);



// Login
router.post('/login', authController.login);

// Verify email
router.post('/verify-email', authController.verifyCode);

// Register
router.post('/register', authController.register);


// Refresh token
router.post('/refresh-token', authController.refreshToken);

// Logout
router.post('/logout',authenticateToken, authController.logout);



module.exports = router;
