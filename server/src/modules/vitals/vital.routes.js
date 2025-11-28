const express = require('express');
const router = express.Router();
const { createVital, getVitalsByPatient } = require('./vital.controller');
const { protect, authorize } = require('../../middleware/auth');
const resolveTenant = require('../../middleware/tenantResolver');

// Apply tenant resolution and authentication middleware to all routes
router.use(resolveTenant);
router.use(protect);

// POST / - Record vitals (Protected, Role: NURSE, DOCTOR)
router.post(
  '/',
  authorize('NURSE', 'DOCTOR', 'HOSPITAL_ADMIN', 'SUPER_ADMIN'),
  createVital
);

// GET /patient/:patientId - Get vitals history for a patient (Protected, Roles: ALL)
router.get('/patient/:patientId', getVitalsByPatient);

module.exports = router;

