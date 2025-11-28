const mongoose = require('mongoose');

const VitalSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required'],
    index: true,
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recorded by user ID is required'],
  },
  bloodPressure: {
    type: String,
    trim: true,
    // Format: "120/80"
  },
  temperature: {
    type: String,
    trim: true,
    // Format: "98.6°F" or "37°C"
  },
  pulse: {
    type: Number,
    min: [0, 'Pulse must be a positive number'],
  },
  spO2: {
    type: Number,
    min: [0, 'SpO2 must be a positive number'],
    max: [100, 'SpO2 cannot exceed 100%'],
  },
  weight: {
    type: Number,
    min: [0, 'Weight must be a positive number'],
  },
  tenantId: {
    type: String,
    required: [true, 'Tenant ID is required'],
    index: true,
  },
}, {
  timestamps: true,
});

// DO NOT export mongoose.model('Vital', VitalSchema)
// INSTEAD export the Schema
module.exports = VitalSchema;

