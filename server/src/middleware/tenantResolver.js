const { getTenantDB } = require('../config/multiTenantDB');

const resolveTenant = async (req, res, next) => {
  try {
    // 1. Check Header (e.g., x-tenant-id: phc_001) or Subdomain
    const tenantId = req.headers['x-tenant-id'];

    if (!tenantId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing x-tenant-id header. Cannot identify Hospital.' 
      });
    }

    // 2. Get the isolated connection
    const tenantDB = await getTenantDB(tenantId);

    // 3. Attach connection to the request object
    req.tenantDB = tenantDB;
    req.tenantId = tenantId;

    next();
  } catch (error) {
    console.error('Tenant Resolution Error:', error);
    res.status(500).json({ success: false, message: 'Database Connection Error' });
  }
};

module.exports = resolveTenant;