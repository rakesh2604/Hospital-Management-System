const VitalSchema = require('./vital.model');

/**
 * Record patient vitals
 */
const createVital = async (req, res) => {
  try {
    // Validate required fields
    const { patientId, bloodPressure, temperature, pulse, spO2, weight } = req.body;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required',
      });
    }

    // Get tenantId from request (from middleware)
    const tenantId = req.tenantId;
    const recordedBy = req.user._id; // From protect middleware

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID is required',
      });
    }

    // Get the Vital model from the CURRENT tenant connection
    const Vital = req.tenantDB.model('Vital', VitalSchema);

    // Verify patient exists in this tenant
    const PatientSchema = require('../patients/patient.model');
    const Patient = req.tenantDB.model('Patient', PatientSchema);
    const patient = await Patient.findOne({ _id: patientId, tenantId });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    // Create new vital record
    const newVital = await Vital.create({
      patientId,
      recordedBy,
      bloodPressure,
      temperature,
      pulse,
      spO2,
      weight,
      tenantId,
    });

    res.status(201).json({
      success: true,
      message: 'Vitals recorded successfully',
      data: newVital,
    });
  } catch (error) {
    console.error('Create vital error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to record vitals',
      error: error.message,
    });
  }
};

/**
 * Get vitals history for a specific patient
 */
const getVitalsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID is required',
      });
    }

    // Get the Vital model from the CURRENT tenant connection
    const Vital = req.tenantDB.model('Vital', VitalSchema);

    // Verify patient exists in this tenant
    const PatientSchema = require('../patients/patient.model');
    const Patient = req.tenantDB.model('Patient', PatientSchema);
    const patient = await Patient.findOne({ _id: patientId, tenantId });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    // Get vitals for this patient, sorted by most recent first
    const vitals = await Vital.find({ patientId, tenantId })
      .populate('recordedBy', 'firstName lastName role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: vitals,
      count: vitals.length,
    });
  } catch (error) {
    console.error('Get vitals by patient error:', error);

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch vitals',
      error: error.message,
    });
  }
};

module.exports = {
  createVital,
  getVitalsByPatient,
};

