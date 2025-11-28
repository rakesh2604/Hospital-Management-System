const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for user
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} role - User role
 * @param {string} tenantId - Tenant ID
 * @returns {string} JWT token
 */
const generateToken = (userId, email, role, tenantId) => {
  return jwt.sign(
    { 
      id: userId, 
      email, 
      role, 
      tenantId 
    },
    process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
};

module.exports = {
  generateToken,
  verifyToken,
};

