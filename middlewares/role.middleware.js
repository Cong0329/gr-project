module.exports = function requireRole(roleCode) {
    return async (req, res, next) => {
      try {
        const userRoles = await req.user.getRoles();
        const hasRole = userRoles.some(role => role.code === roleCode);
        if (!hasRole) {
          return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
        next();
      } catch (err) {
        console.error('Role check error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    };
  };
  
  