const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  prescriptionId: {
    type: String,
    unique: true,
    required: [true, 'Prescription ID is required'],
    index: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required'],
    index: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Doctor ID is required'],
  },
  diagnosis: {
    type: String,
    required: [true, 'Diagnosis is required'],
    trim: true,
  },
  medicines: [{
    name: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true,
    },
    dosage: {
      type: String,
      required: [true, 'Dosage is required'],
      trim: true,
      // Format: "500mg", "10ml", etc.
    },
    frequency: {
      type: String,
      required: [true, 'Frequency is required'],
      trim: true,
      // Format: "Twice daily", "After meals", etc.
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
      // Format: "7 days", "2 weeks", etc.
    },
    instructions: {
      type: String,
      trim: true,
      // Additional instructions for the patient
    },
  }],
  tenantId: {
    type: String,
    required: [true, 'Tenant ID is required'],
    index: true,
  },
}, {
  timestamps: true,
});

// DO NOT export mongoose.model('Prescription', PrescriptionSchema)
// INSTEAD export the Schema
module.exports = PrescriptionSchema;

