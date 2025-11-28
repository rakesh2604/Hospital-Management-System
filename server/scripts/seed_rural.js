const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const { getTenantDB } = require('../src/config/multiTenantDB');
const UserSchema = require('../src/modules/auth/user.model');

const seedRural = async () => {
  try {
    // Check if MONGO_URI is set
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is not set in environment variables.');
      console.error('   Please create a .env file in the server directory with:');
      console.error('   MONGO_URI=mongodb://localhost:27017');
      process.exit(1);
    }

    const tenantId = 'phc_rural';
    const adminEmail = 'admin@rural.com';

    console.log(`🔗 Connecting to tenant: ${tenantId}...`);

    // Get tenant database connection
    const tenantDB = await getTenantDB(tenantId);

    // Create User model for this tenant
    const User = tenantDB.model('User', UserSchema);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    // Create new admin user
    const adminUser = await User.create({
      firstName: 'Rural',
      lastName: 'Admin',
      email: adminEmail,
      password: 'password123', // Will be hashed by pre-save hook
      role: 'HOSPITAL_ADMIN',
      tenantId: tenantId,
    });

    console.log('✅ Rural PHC Seeded Successfully');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.firstName} ${adminUser.lastName}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Tenant: ${adminUser.tenantId}`);

    // Close the connection
    await tenantDB.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedRural();

