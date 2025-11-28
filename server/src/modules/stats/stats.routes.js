const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('./stats.controller');
const { protect } = require('../../middleware/auth');
const resolveTenant = require('../../middleware/tenantResolver');

// Apply tenant resolution and authentication middleware to all routes
router.use(resolveTenant);
router.use(protect);

// GET /dashboard - Get dashboard statistics (Protected, All roles)
router.get('/dashboard', getDashboardStats);

module.exports = router;

