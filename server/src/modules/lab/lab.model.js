const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
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
  testName: {
    type: String,
    required: [true, 'Test name is required'],
    enum: ['Blood Test', 'Urine Test', 'Malaria', 'X-Ray'],
    trim: true,
  },
  result: {
    type: String,
    required: [true, 'Test result is required'],
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  fileData: {
    type: String,
    // Base64 encoded file data
  },
  fileType: {
    type: String,
    // MIME type: 'application/pdf', 'image/jpeg', 'image/png', etc.
  },
  fileName: {
    type: String,
    trim: true,
  },
  tenantId: {
    type: String,
    required: [true, 'Tenant ID is required'],
    index: true,
  },
}, {
  timestamps: true,
});

// DO NOT export mongoose.model('Lab', LabSchema)
// INSTEAD export the Schema
module.exports = LabSchema;

