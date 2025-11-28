const PrescriptionSchema = require('./prescription.model');

/**
 * Create a new prescription
 * Auto-generates prescriptionId in format: {tenantId}-RX-{number}
 */
const createPrescription = async (req, res) => {
  try {
    // Validate required fields
    const { patientId, diagnosis, medicines } = req.body;

    if (!patientId || !diagnosis || !medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: patientId, diagnosis, medicines (array)',
      });
    }

    // Validate medicines array
    for (const medicine of medicines) {
      if (!medicine.name || !medicine.dosage || !medicine.frequency || !medicine.duration) {
        return res.status(400).json({
          success: false,
          message: 'Each medicine must have: name, dosage, frequency, duration',
        });
      }
    }

    // Get tenantId from request (from middleware)
    const tenantId = req.tenantId;
    const doctorId = req.user._id; // From protect middleware

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID is required',
      });
    }

    // Verify user is a doctor
    if (!['DOCTOR', 'HOSPITAL_ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can create prescriptions',
      });
    }

    // Get the Prescription model from the CURRENT tenant connection
    const Prescription = req.tenantDB.model('Prescription', PrescriptionSchema);

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

    // Auto-generate Prescription ID: Count existing documents and add 1
    const count = await Prescription.countDocuments({ tenantId });
    const prescriptionId = `${tenantId}-RX-${count + 1}`;

    // Create new prescription
    const newPrescription = await Prescription.create({
      prescriptionId,
      patientId,
      doctorId,
      diagnosis,
      medicines,
      tenantId,
    });

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: newPrescription,
    });
  } catch (error) {
    console.error('Create prescription error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Prescription ID already exists',
      });
    }

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
      message: 'Failed to create prescription',
      error: error.message,
    });
  }
};

/**
 * Get prescription history for a specific patient
 */
const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID is required',
      });
    }

    // Get the Prescription model from the CURRENT tenant connection
    const Prescription = req.tenantDB.model('Prescription', PrescriptionSchema);

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

    // Get prescriptions for this patient, sorted by most recent first
    const prescriptions = await Prescription.find({ patientId, tenantId })
      .populate('doctorId', 'firstName lastName role')
      .populate('patientId', 'firstName lastName patientId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: prescriptions,
      count: prescriptions.length,
    });
  } catch (error) {
    console.error('Get prescriptions by patient error:', error);

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch prescriptions',
      error: error.message,
    });
  }
};

/**
 * Dispense prescription (update status to DISPENSED)
 */
const dispensePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID is required',
      });
    }

    // Get the Prescription model from the CURRENT tenant connection
    const Prescription = req.tenantDB.model('Prescription', PrescriptionSchema);

    // Find prescription by ID and tenantId
    const prescription = await Prescription.findOne({ _id: id, tenantId });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
      });
    }

    // Check if already dispensed
    if (prescription.status === 'DISPENSED') {
      return res.status(400).json({
        success: false,
        message: 'Prescription is already dispensed',
      });
    }

    // Update status to DISPENSED
    prescription.status = 'DISPENSED';
    await prescription.save();

    // Populate for response
    await prescription.populate('doctorId', 'firstName lastName role');
    await prescription.populate('patientId', 'firstName lastName patientId');

    res.status(200).json({
      success: true,
      message: 'Prescription dispensed successfully',
      data: prescription,
    });
  } catch (error) {
    console.error('Dispense prescription error:', error);

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid prescription ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to dispense prescription',
      error: error.message,
    });
  }
};

module.exports = {
  createPrescription,
  getPrescriptionsByPatient,
  dispensePrescription,
};

