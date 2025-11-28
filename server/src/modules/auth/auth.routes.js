const express = require('express');
const router = express.Router();
const { register, login, getMe, registerStaff } = require('./auth.controller');
const { protect, authorize } = require('../../middleware/auth');
const resolveTenant = require('../../middleware/tenantResolver');

// Apply tenant resolution middleware to all auth routes
router.use(resolveTenant);

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route - requires authentication
router.get('/me', protect, getMe);

// Protected route - only HOSPITAL_ADMIN can register staff
router.post('/register-staff', protect, authorize('HOSPITAL_ADMIN'), registerStaff);

module.exports = router;

