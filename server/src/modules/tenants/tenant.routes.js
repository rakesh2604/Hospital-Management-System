const express = require('express');
const router = express.Router();
const { registerHospital } = require('./tenant.controller');

// Public route - no authentication or tenant resolution needed
// We are CREATING a tenant, not accessing one
router.post('/register', registerHospital);

module.exports = router;

