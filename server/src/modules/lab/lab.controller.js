const LabSchema = require('./lab.model');

/**
 * Create a new lab result
 */
const createLabResult = async (req, res) => {
  try {
    // Validate required fields
    const { patientId, testName, result, notes } = req.body;

    if (!patientId || !testName || !result) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID, test name, and result are required',
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

    // Get the Lab model from the CURRENT tenant connection
    const Lab = req.tenantDB.model('Lab', LabSchema);

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

    // Create new lab result
    const newLabResult = await Lab.create({
      patientId,
      recordedBy,
      testName,
      result,
      notes: notes || '',
      tenantId,
    });

    // Populate recordedBy for response
    await newLabResult.populate('recordedBy', 'firstName lastName role');

    res.status(201).json({
      success: true,
      message: 'Lab result recorded successfully',
      data: newLabResult,
    });
  } catch (error) {
    console.error('Create lab result error:', error);

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
      message: 'Failed to create lab result',
      error: error.message,
    });
  }
};

/**
 * Get lab results history for a specific patient
 */
const getLabResultsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID is required',
      });
    }

    // Get the Lab model from the CURRENT tenant connection
    const Lab = req.tenantDB.model('Lab', LabSchema);

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

    // Get lab results for this patient, sorted by most recent first
    const labResults = await Lab.find({ patientId, tenantId })
      .populate('recordedBy', 'firstName lastName role')
      .populate('patientId', 'firstName lastName patientId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: labResults,
      count: labResults.length,
    });
  } catch (error) {
    console.error('Get lab results by patient error:', error);

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch lab results',
      error: error.message,
    });
  }
};

module.exports = {
  createLabResult,
  getLabResultsByPatient,
};

