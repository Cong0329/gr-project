const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();


// Google Authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Callback
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    const user = req.user;
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );
    
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '10d' }
    );

    res.json({ accessToken, refreshToken });
  }
);

// Refresh token
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
});





module.exports = router;
