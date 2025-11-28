import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  LocalPharmacy as PharmacyIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import api from '../api/axios';
import PrescriptionPrint from '../components/PrescriptionPrint';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get user role from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userRole = user?.role || '';

  // Role-based permissions
  const canRecordVitals = ['NURSE', 'DOCTOR', 'HOSPITAL_ADMIN'].includes(userRole);
  const canWritePrescription = ['DOCTOR', 'HOSPITAL_ADMIN'].includes(userRole);
  const canAddLabReport = ['LAB_TECHNICIAN', 'HOSPITAL_ADMIN'].includes(userRole);
  const canDispensePrescription = ['PHARMACIST', 'HOSPITAL_ADMIN'].includes(userRole);

  // Patient data
  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labResults, setLabResults] = useState([]);

  // Dialog states
  const [vitalsDialogOpen, setVitalsDialogOpen] = useState(false);
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  const [labDialogOpen, setLabDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const printRef = useRef();

  // Vitals form
  const [vitalsForm, setVitalsForm] = useState({
    bloodPressure: '',
    temperature: '',
    pulse: '',
    spO2: '',
    weight: '',
  });

  // Prescription form
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
  });

  // Lab form
  const [labForm, setLabForm] = useState({
    testName: '',
    result: '',
    notes: '',
  });

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [patientRes, vitalsRes, prescriptionsRes, labRes] = await Promise.all([
        api.get(`/patients/${id}`),
        api.get(`/vitals/patient/${id}`),
        api.get(`/prescriptions/patient/${id}`),
        api.get(`/lab/patient/${id}`),
      ]);

      if (patientRes.data.success) {
        setPatient(patientRes.data.data);
      }
      if (vitalsRes.data.success) {
        setVitals(vitalsRes.data.data || []);
      }
      if (prescriptionsRes.data.success) {
        setPrescriptions(prescriptionsRes.data.data || []);
      }
      if (labRes.data.success) {
        setLabResults(labRes.data.data || []);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch patient data';
      setError(errorMessage);
      toast.error(errorMessage);
      if (err.response?.status === 404) {
        navigate('/patients');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  // Handle vitals form submission
  const handleVitalsSubmit = async () => {
    try {
      const response = await api.post('/vitals', {
        patientId: id,
        ...vitalsForm,
      });

      if (response.data.success) {
        toast.success('Vitals recorded successfully');
        setVitalsDialogOpen(false);
        setVitalsForm({
          bloodPressure: '',
          temperature: '',
          pulse: '',
          spO2: '',
          weight: '',
        });
        fetchData(); // Refresh vitals
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to record vitals';
      toast.error(errorMessage);
    }
  };

  // Handle prescription form submission
  const handlePrescriptionSubmit = async () => {
    try {
      // Validate medicines
      const validMedicines = prescriptionForm.medicines.filter(
        (med) => med.name && med.dosage && med.frequency && med.duration
      );

      if (validMedicines.length === 0) {
        toast.error('Please add at least one medicine');
        return;
      }

      const response = await api.post('/prescriptions', {
        patientId: id,
        diagnosis: prescriptionForm.diagnosis,
        medicines: validMedicines,
      });

      if (response.data.success) {
        toast.success('Prescription created successfully');
        setPrescriptionDialogOpen(false);
        setPrescriptionForm({
          diagnosis: '',
          medicines: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
        });
        fetchData(); // Refresh prescriptions
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create prescription';
      toast.error(errorMessage);
    }
  };

  // Add medicine to prescription form
  const addMedicine = () => {
    setPrescriptionForm({
      ...prescriptionForm,
      medicines: [
        ...prescriptionForm.medicines,
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
      ],
    });
  };

  // Remove medicine from prescription form
  const removeMedicine = (index) => {
    const newMedicines = prescriptionForm.medicines.filter((_, i) => i !== index);
    setPrescriptionForm({
      ...prescriptionForm,
      medicines: newMedicines.length > 0 ? newMedicines : [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    });
  };

  // Update medicine field
  const updateMedicine = (index, field, value) => {
    const newMedicines = [...prescriptionForm.medicines];
    newMedicines[index][field] = value;
    setPrescriptionForm({ ...prescriptionForm, medicines: newMedicines });
  };

  // Handle lab form submission
  const handleLabSubmit = async () => {
    try {
      if (!labForm.testName || !labForm.result) {
        toast.error('Test name and result are required');
        return;
      }

      const response = await api.post('/lab', {
        patientId: id,
        testName: labForm.testName,
        result: labForm.result,
        notes: labForm.notes || '',
      });

      if (response.data.success) {
        toast.success('Lab result recorded successfully');
        setLabDialogOpen(false);
        setLabForm({
          testName: '',
          result: '',
          notes: '',
        });
        fetchData(); // Refresh lab results
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to record lab result';
      toast.error(errorMessage);
    }
  };

  // Handle dispense prescription
  const handleDispensePrescription = async (prescriptionId) => {
    try {
      const response = await api.patch(`/prescriptions/${prescriptionId}/dispense`);

      if (response.data.success) {
        toast.success('Prescription dispensed successfully');
        fetchData(); // Refresh prescriptions
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to dispense prescription';
      toast.error(errorMessage);
    }
  };

  // Print prescription handler
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Prescription_${selectedPrescription?.prescriptionId}`,
  });

  const handlePrintClick = (prescription) => {
    setSelectedPrescription(prescription);
    // Small delay to ensure state is set before printing
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  const hospitalName = localStorage.getItem('tenantId') || 'Hospital';

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !patient) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Patient not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Patient Basic Info Card */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#1976d2', fontWeight: 600, mb: 2 }}>
          Patient Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">Name</Typography>
            <Typography variant="h6">
              {patient.firstName} {patient.lastName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">Patient ID</Typography>
            <Typography variant="h6">{patient.patientId}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="body2" color="text.secondary">Age</Typography>
            <Typography variant="h6">{calculateAge(patient.dob)} years</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="body2" color="text.secondary">Gender</Typography>
            <Typography variant="h6">{patient.gender}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="body2" color="text.secondary">Blood Group</Typography>
            <Typography variant="h6">{patient.bloodGroup || 'N/A'}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs Section */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Overview" />
            <Tab label="Vitals" />
            <Tab label="Prescriptions" />
            <Tab label="Lab Reports" />
          </Tabs>
        </Box>

        {/* Tab 1: Overview */}
        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Patient Overview
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Contact Information
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Phone:</strong> {patient.phone}
                    </Typography>
                    {patient.address && (
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        <strong>Address:</strong> {patient.address}
                      </Typography>
                    )}
                    {patient.emergencyContact?.name && (
                      <>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          <strong>Emergency Contact:</strong> {patient.emergencyContact.name}
                        </Typography>
                        {patient.emergencyContact.phone && (
                          <Typography variant="body1">
                            <strong>Emergency Phone:</strong> {patient.emergencyContact.phone}
                          </Typography>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Statistics
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Total Vitals Records:</strong> {vitals.length}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Total Prescriptions:</strong> {prescriptions.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab 2: Vitals */}
        {tabValue === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Vitals History</Typography>
              {canRecordVitals && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setVitalsDialogOpen(true)}
                  sx={{
                    backgroundColor: '#1976d2',
                    '&:hover': { backgroundColor: '#1565c0' },
                  }}
                >
                  Record Vitals
                </Button>
              )}
            </Box>

            {vitals.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                No vitals records found.
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Blood Pressure</TableCell>
                      <TableCell>Pulse</TableCell>
                      <TableCell>Temperature</TableCell>
                      <TableCell>SpO2 (%)</TableCell>
                      <TableCell>Weight (kg)</TableCell>
                      <TableCell>Recorded By</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vitals.map((vital) => (
                      <TableRow key={vital._id}>
                        <TableCell>{formatDate(vital.createdAt)}</TableCell>
                        <TableCell>{vital.bloodPressure || 'N/A'}</TableCell>
                        <TableCell>{vital.pulse || 'N/A'}</TableCell>
                        <TableCell>{vital.temperature || 'N/A'}</TableCell>
                        <TableCell>{vital.spO2 || 'N/A'}</TableCell>
                        <TableCell>{vital.weight || 'N/A'}</TableCell>
                        <TableCell>
                          {vital.recordedBy?.firstName} {vital.recordedBy?.lastName}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Vitals Dialog */}
            <Dialog open={vitalsDialogOpen} onClose={() => setVitalsDialogOpen(false)} maxWidth="sm" fullWidth>
              <DialogTitle>Record Vitals</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Blood Pressure"
                      placeholder="e.g., 120/80"
                      value={vitalsForm.bloodPressure}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, bloodPressure: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Temperature"
                      placeholder="e.g., 98.6°F"
                      value={vitalsForm.temperature}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, temperature: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Pulse (bpm)"
                      type="number"
                      value={vitalsForm.pulse}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, pulse: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="SpO2 (%)"
                      type="number"
                      inputProps={{ min: 0, max: 100 }}
                      value={vitalsForm.spO2}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, spO2: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Weight (kg)"
                      type="number"
                      value={vitalsForm.weight}
                      onChange={(e) => setVitalsForm({ ...vitalsForm, weight: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setVitalsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleVitalsSubmit} variant="contained">
                  Record
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}

        {/* Tab 3: Prescriptions */}
        {tabValue === 2 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Prescription History</Typography>
              {canWritePrescription && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setPrescriptionDialogOpen(true)}
                  sx={{
                    backgroundColor: '#1976d2',
                    '&:hover': { backgroundColor: '#1565c0' },
                  }}
                >
                  Write Prescription
                </Button>
              )}
            </Box>

            {prescriptions.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                No prescriptions found.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {prescriptions.map((prescription) => (
                  <Grid item xs={12} md={6} key={prescription._id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6">{prescription.prescriptionId}</Typography>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                              label={prescription.status || 'PENDING'}
                              size="small"
                              color={prescription.status === 'DISPENSED' ? 'success' : 'warning'}
                              sx={{
                                fontWeight: 600,
                              }}
                            />
                            <Chip label={formatDate(prescription.createdAt)} size="small" />
                            <IconButton
                              color="primary"
                              onClick={() => handlePrintClick(prescription)}
                              sx={{
                                backgroundColor: '#1976d2',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: '#1565c0',
                                },
                              }}
                              size="small"
                            >
                              <PrintIcon />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                          Diagnosis
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {prescription.diagnosis}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          Medicines
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {prescription.medicines.map((medicine, idx) => (
                            <Box key={idx} sx={{ mb: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {medicine.name} - {medicine.dosage}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {medicine.frequency} for {medicine.duration}
                              </Typography>
                              {medicine.instructions && (
                                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                  Note: {medicine.instructions}
                                </Typography>
                              )}
                            </Box>
                          ))}
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                          Prescribed by: {prescription.doctorId?.firstName} {prescription.doctorId?.lastName}
                        </Typography>
                        {canDispensePrescription && prescription.status === 'PENDING' && (
                          <Box sx={{ mt: 2 }}>
                            <Button
                              variant="contained"
                              color="success"
                              startIcon={<PharmacyIcon />}
                              onClick={() => handleDispensePrescription(prescription._id)}
                              fullWidth
                              sx={{
                                backgroundColor: '#2e7d32',
                                '&:hover': {
                                  backgroundColor: '#1b5e20',
                                },
                              }}
                            >
                              Dispense Medicines
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Prescription Dialog */}
            <Dialog
              open={prescriptionDialogOpen}
              onClose={() => setPrescriptionDialogOpen(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>Write Prescription</DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  label="Diagnosis"
                  value={prescriptionForm.diagnosis}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, diagnosis: e.target.value })}
                  sx={{ mb: 3, mt: 2 }}
                  required
                  multiline
                  rows={2}
                />

                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Medicines
                </Typography>

                {prescriptionForm.medicines.map((medicine, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2">Medicine {index + 1}</Typography>
                      {prescriptionForm.medicines.length > 1 && (
                        <IconButton size="small" onClick={() => removeMedicine(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Medicine Name"
                          value={medicine.name}
                          onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Dosage"
                          placeholder="e.g., 500mg"
                          value={medicine.dosage}
                          onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Frequency"
                          placeholder="e.g., Twice daily"
                          value={medicine.frequency}
                          onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Duration"
                          placeholder="e.g., 7 days"
                          value={medicine.duration}
                          onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Instructions (Optional)"
                          value={medicine.instructions}
                          onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                          multiline
                          rows={2}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                ))}

                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addMedicine}
                  sx={{ mt: 1 }}
                >
                  Add Medicine
                </Button>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setPrescriptionDialogOpen(false)}>Cancel</Button>
                <Button onClick={handlePrescriptionSubmit} variant="contained">
                  Create Prescription
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}

        {/* Tab 4: Lab Reports */}
        {tabValue === 3 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Lab Reports</Typography>
              {canAddLabReport && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setLabDialogOpen(true)}
                  sx={{
                    backgroundColor: '#1976d2',
                    '&:hover': { backgroundColor: '#1565c0' },
                  }}
                >
                  Add Report
                </Button>
              )}
            </Box>

            {labResults.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                No lab reports found.
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Test Name</TableCell>
                      <TableCell>Result</TableCell>
                      <TableCell>Notes</TableCell>
                      <TableCell>Recorded By</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {labResults.map((lab) => (
                      <TableRow key={lab._id}>
                        <TableCell>{formatDate(lab.createdAt)}</TableCell>
                        <TableCell>
                          <Chip label={lab.testName} size="small" color="primary" />
                        </TableCell>
                        <TableCell>{lab.result}</TableCell>
                        <TableCell>{lab.notes || 'N/A'}</TableCell>
                        <TableCell>
                          {lab.recordedBy?.firstName} {lab.recordedBy?.lastName}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Lab Report Dialog */}
            <Dialog
              open={labDialogOpen}
              onClose={() => setLabDialogOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Add Lab Report</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Test Name</InputLabel>
                      <Select
                        value={labForm.testName}
                        label="Test Name"
                        onChange={(e) => setLabForm({ ...labForm, testName: e.target.value })}
                      >
                        <MenuItem value="Blood Test">Blood Test</MenuItem>
                        <MenuItem value="Urine Test">Urine Test</MenuItem>
                        <MenuItem value="Malaria">Malaria</MenuItem>
                        <MenuItem value="X-Ray">X-Ray</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Result"
                      value={labForm.result}
                      onChange={(e) => setLabForm({ ...labForm, result: e.target.value })}
                      required
                      multiline
                      rows={3}
                      placeholder="Enter test results..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notes (Optional)"
                      value={labForm.notes}
                      onChange={(e) => setLabForm({ ...labForm, notes: e.target.value })}
                      multiline
                      rows={2}
                      placeholder="Additional notes or observations..."
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setLabDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleLabSubmit} variant="contained">
                  Save Report
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      </Paper>

      {/* Hidden Print Component */}
      {selectedPrescription && (
        <PrescriptionPrint
          ref={printRef}
          prescription={selectedPrescription}
          patient={patient}
          hospitalName={hospitalName}
        />
      )}
    </Container>
  );
};

export default PatientDetails;

