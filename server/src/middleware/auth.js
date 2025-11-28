const { verifyToken } = require('../modules/auth/auth.utils');

/**
 * Middleware to protect routes - verifies JWT token
 * Attaches user info to req.user
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    try {
      // Verify token
      const decoded = verifyToken(token);

      // Check if tenantId in token matches req.tenantId (if available)
      if (req.tenantId && decoded.tenantId !== req.tenantId) {
        return res.status(403).json({
          success: false,
          message: 'Token tenant mismatch',
        });
      }

      // Get User model from tenant connection
      if (!req.tenantDB) {
        return res.status(500).json({
          success: false,
          message: 'Tenant database connection not found',
        });
      }

      const UserSchema = require('../modules/auth/user.model');
      const User = req.tenantDB.model('User', UserSchema);

      // Find user by ID from token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};

/**
 * Middleware to authorize specific roles
 * @param {...string} roles - Roles allowed to access the route
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};

