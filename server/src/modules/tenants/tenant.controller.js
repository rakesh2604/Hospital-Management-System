const { getTenantDB } = require('../../config/multiTenantDB');
const UserSchema = require('../auth/user.model');
const crypto = require('crypto');

/**
 * Register a new hospital (tenant)
 * Creates a new database connection and the first admin user
 */
const registerHospital = async (req, res) => {
  try {
    const { hospitalName, address, adminName, adminEmail, password, licenseNumber } = req.body;

    // Validate required fields
    if (!hospitalName || !address || !adminName || !adminEmail || !password || !licenseNumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: hospitalName, address, adminName, adminEmail, password, licenseNumber',
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(adminEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Generate URL-friendly tenantId from hospitalName
    // Convert to lowercase, replace spaces/special chars with underscores, add random suffix
    const baseTenantId = hospitalName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
    
    // Add random suffix to ensure uniqueness
    const randomSuffix = crypto.randomBytes(4).toString('hex');
    const tenantId = `${baseTenantId}_${randomSuffix}`;

    // Split adminName into firstName and lastName
    const nameParts = adminName.trim().split(/\s+/);
    const firstName = nameParts[0] || adminName;
    const lastName = nameParts.slice(1).join(' ') || 'Admin';

    // Get or create tenant database connection
    const tenantDB = await getTenantDB(tenantId);

    // Create User model for this tenant
    const User = tenantDB.model('User', UserSchema);

    // Check if admin email already exists in this tenant
    const existingUser = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create the first admin user
    const adminUser = await User.create({
      firstName,
      lastName,
      email: adminEmail.toLowerCase(),
      password, // Will be hashed by pre-save hook
      role: 'HOSPITAL_ADMIN',
      tenantId: tenantId,
    });

    // Remove password from response
    const userResponse = adminUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Hospital registered successfully',
      data: {
        tenantId: tenantId,
        hospitalName,
        address,
        licenseNumber,
        admin: userResponse,
      },
    });
  } catch (error) {
    console.error('Hospital registration error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
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
      message: 'Hospital registration failed',
      error: error.message,
    });
  }
};

module.exports = {
  registerHospital,
};

