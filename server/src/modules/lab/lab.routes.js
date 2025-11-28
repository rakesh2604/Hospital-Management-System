const express = require('express');
const router = express.Router();
const { createLabResult, getLabResultsByPatient } = require('./lab.controller');
const { protect, authorize } = require('../../middleware/auth');
const resolveTenant = require('../../middleware/tenantResolver');

// Apply tenant resolution and authentication middleware to all routes
router.use(resolveTenant);
router.use(protect);

// POST / - Create lab result (Protected, Role: LAB_TECHNICIAN, HOSPITAL_ADMIN)
router.post(
  '/',
  authorize('LAB_TECHNICIAN', 'HOSPITAL_ADMIN', 'SUPER_ADMIN'),
  createLabResult
);

// GET /patient/:patientId - Get lab results history for a patient (Protected, Roles: ALL)
router.get('/patient/:patientId', getLabResultsByPatient);

module.exports = router;

