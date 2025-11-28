const PatientSchema = require('../patients/patient.model');
const VitalSchema = require('../vitals/vital.model');
const PrescriptionSchema = require('../prescriptions/prescription.model');

/**
 * Get dashboard statistics
 * Uses req.tenantDB to query the current tenant's database
 */
const getDashboardStats = async (req, res) => {
  try {
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID is required',
      });
    }

    // Get models from tenant connection
    const Patient = req.tenantDB.model('Patient', PatientSchema);
    const Vital = req.tenantDB.model('Vital', VitalSchema);
    const Prescription = req.tenantDB.model('Prescription', PrescriptionSchema);

    // Get today's date range (start and end of today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get last 7 days for patient registration chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // 1. Total Patients
    const totalPatients = await Patient.countDocuments({ tenantId });

    // 2. Today's Patients (registered today)
    const todayPatients = await Patient.countDocuments({
      tenantId,
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    // 3. Patients by Gender (aggregate)
    const patientsByGender = await Patient.aggregate([
      { $match: { tenantId } },
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          gender: '$_id',
          count: 1,
        },
      },
    ]);

    // 4. Recent Vitals (last 5)
    const recentVitals = await Vital.find({ tenantId })
      .populate('patientId', 'firstName lastName patientId')
      .populate('recordedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-__v');

    // 5. Patients registered in last 7 days (for bar chart)
    const patientsLast7Days = await Patient.aggregate([
      {
        $match: {
          tenantId,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1,
        },
      },
    ]);

    // Fill in missing days with 0
    const dateMap = new Map();
    patientsLast7Days.forEach((item) => {
      dateMap.set(item.date, item.count);
    });

    const last7DaysData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last7DaysData.push({
        date: dateStr,
        count: dateMap.get(dateStr) || 0,
      });
    }

    // 6. Pending Prescriptions (total prescriptions for now, since no status field)
    const pendingPrescriptions = await Prescription.countDocuments({ tenantId });

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        todayPatients,
        patientsByGender,
        recentVitals,
        patientsLast7Days: last7DaysData,
        pendingPrescriptions,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};

