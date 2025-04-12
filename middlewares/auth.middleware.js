const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Đảm bảo đúng path tới models

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: 'Access token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Lấy user từ database để có full Sequelize instance (có .getRoles())
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(403).json({ message: 'User not found' });

    req.user = user; // Sequelize instance
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateToken;
