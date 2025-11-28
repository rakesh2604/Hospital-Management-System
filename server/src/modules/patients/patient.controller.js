const PatientSchema = require('./patient.model');

/**
 * Create a new patient
 * Auto-generates patientId in format: {tenantId}-P-{number}
 */
const createPatient = async (req, res) => {
  try {
    // Validate required fields
    const { firstName, lastName, gender, dob, phone, address, bloodGroup, emergencyContact } = req.body;

    if (!firstName || !lastName || !gender || !dob || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: firstName, lastName, gender, dob, phone',
      });
    }

    // Validate gender enum
    const validGenders = ['Male', 'Female', 'Other'];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({
        success: false,
        message: `Invalid gender. Must be one of: ${validGenders.join(', ')}`,
      });
    }

    // Get tenantId from request (from middleware)
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID is required',
      });
    }

    // Get the Patient model from the CURRENT tenant connection
    const Patient = req.tenantDB.model('Patient', PatientSchema);

    // Auto-generate Patient ID: Count existing documents and add 1
    const count = await Patient.countDocuments({ tenantId });
    const patientId = `${tenantId}-P-${count + 1}`;

    // Create new patient
    const newPatient = await Patient.create({
      firstName,
      lastName,
      gender,
      dob,
      phone,
      address,
      bloodGroup,
      patientId,
      tenantId,
      emergencyContact: emergencyContact || {},
    });

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: newPatient,
    });
  } catch (error) {
    console.error('Create patient error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Patient ID already exists',
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

    res.status(500).json({
      success: false,
      message: 'Failed to create patient',
      error: error.message,
    });
  }
};

/**
 * Get all patients with optional search and pagination
 */
const getPatients = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID is required',
      });
    }

    // Get the Patient model from the CURRENT tenant connection
    const Patient = req.tenantDB.model('Patient', PatientSchema);

    // Build query
    const query = { tenantId };

    // Add search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const [patients, total] = await Promise.all([
      Patient.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Patient.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: patients,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients',
      error: error.message,
    });
  }
};

/**
 * Get single patient by ID
 */
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID is required',
      });
    }

    // Get the Patient model from the CURRENT tenant connection
    const Patient = req.tenantDB.model('Patient', PatientSchema);

    // Find patient by ID and tenantId (for security)
    const patient = await Patient.findOne({
      _id: id,
      tenantId: tenantId,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error('Get patient by ID error:', error);

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient',
      error: error.message,
    });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
};
