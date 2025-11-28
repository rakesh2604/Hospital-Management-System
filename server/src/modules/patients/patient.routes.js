const express = require('express');
const router = express.Router();
const { createPatient, getPatients, getPatientById } = require('./patient.controller');
const { protect, authorize } = require('../../middleware/auth');
const resolveTenant = require('../../middleware/tenantResolver');

// Apply tenant resolution and authentication middleware to all routes
router.use(resolveTenant);
router.use(protect);

// POST / - Register patient (Protected, Roles: RECEPTIONIST, ADMIN)
router.post(
  '/',
  authorize('RECEPTIONIST', 'HOSPITAL_ADMIN', 'SUPER_ADMIN'),
  createPatient
);

// GET / - List patients (Protected, Roles: ALL)
router.get('/', getPatients);

// GET /:id - Get specific patient (Protected, Roles: ALL)
router.get('/:id', getPatientById);

module.exports = router;

