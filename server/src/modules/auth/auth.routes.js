const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('./auth.controller');
const { protect } = require('../../middleware/auth');
const resolveTenant = require('../../middleware/tenantResolver');

// Apply tenant resolution middleware to all auth routes
router.use(resolveTenant);

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route - requires authentication
router.get('/me', protect, getMe);

module.exports = router;

