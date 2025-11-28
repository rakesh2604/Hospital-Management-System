const express = require('express');
const router = express.Router();
const { createPrescription, getPrescriptionsByPatient, dispensePrescription } = require('./prescription.controller');
const { protect, authorize } = require('../../middleware/auth');
const resolveTenant = require('../../middleware/tenantResolver');

// Apply tenant resolution and authentication middleware to all routes
router.use(resolveTenant);
router.use(protect);

// POST / - Create Prescription (Protected, Role: DOCTOR)
router.post(
  '/',
  authorize('DOCTOR', 'HOSPITAL_ADMIN', 'SUPER_ADMIN'),
  createPrescription
);

// GET /patient/:patientId - Get prescription history (Protected, Roles: ALL)
router.get('/patient/:patientId', getPrescriptionsByPatient);

// PATCH /:id/dispense - Dispense prescription (Protected, Role: PHARMACIST, HOSPITAL_ADMIN)
router.patch(
  '/:id/dispense',
  authorize('PHARMACIST', 'HOSPITAL_ADMIN', 'SUPER_ADMIN'),
  dispensePrescription
);

module.exports = router;

