require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import Middleware
const resolveTenant = require('./src/middleware/tenantResolver');

// Import Routes
const authRoutes = require('./src/modules/auth/auth.routes');
const patientRoutes = require('./src/modules/patients/patient.routes');
const vitalRoutes = require('./src/modules/vitals/vital.routes');
const prescriptionRoutes = require('./src/modules/prescriptions/prescription.routes');

const app = express();

// 1. Global Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Allow frontend access
app.use(express.json()); // Parse JSON bodies

// 2. Health Check (Crucial for Deployment)
app.get('/', (req, res) => {
  res.send('PHC Multi-Tenant API is Running...');
});

// 3. Mount Routes
// Note: resolveTenant is applied INSIDE each route module, so we don't apply it globally here.
// This allows routes to control when tenant resolution happens.

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/vitals', vitalRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// 4. Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});