const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required'],
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  bloodGroup: {
    type: String,
    trim: true,
    uppercase: true,
  },
  patientId: {
    type: String,
    unique: true,
    required: [true, 'Patient ID is required'],
    index: true,
  },
  tenantId: {
    type: String,
    required: [true, 'Tenant ID is required'],
    index: true,
  },
  emergencyContact: {
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
}, {
  timestamps: true,
});

// DO NOT export mongoose.model('Patient', PatientSchema)
// INSTEAD export the Schema
module.exports = PatientSchema;
