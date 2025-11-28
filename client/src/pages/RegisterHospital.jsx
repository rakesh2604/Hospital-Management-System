import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Divider,
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../api/axios';

const RegisterHospital = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hospitalName: '',
    licenseNumber: '',
    address: '',
    adminName: '',
    adminEmail: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successDialog, setSuccessDialog] = useState(false);
  const [registeredTenantId, setRegisteredTenantId] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Make API call without tenant header (we're creating a new tenant)
      // The interceptor automatically skips tenant header for this endpoint
      const response = await api.post('/tenants/register', formData);

      if (response.data.success) {
        setRegisteredTenantId(response.data.data.tenantId);
        setSuccessDialog(true);
        toast.success('Hospital registered successfully!');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setSuccessDialog(false);
    // Navigate to login with tenantId pre-filled
    navigate(`/login?tenantId=${registeredTenantId}`);
  };

  return (
    <>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Card sx={{ width: '100%', boxShadow: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  color: '#1976d2',
                  fontWeight: 600,
                  mb: 1,
                  textAlign: 'center',
                }}
              >
                Register Your Hospital
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 4, textAlign: 'center', color: '#666' }}
              >
                Get started with our hospital management system
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
                  Hospital Information
                </Typography>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Hospital Name"
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleChange}
                      required
                      placeholder="e.g., City Care Hospital"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="License Number"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
                  Admin Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="adminName"
                      value={formData.adminName}
                      onChange={handleChange}
                      required
                      placeholder="e.g., John Doe"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="adminEmail"
                      type="email"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      helperText="Minimum 6 characters"
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/')}
                    sx={{ py: 1.5 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      backgroundColor: '#1976d2',
                      '&:hover': {
                        backgroundColor: '#1565c0',
                      },
                    }}
                  >
                    {loading ? 'Registering...' : 'Register Hospital'}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Success Dialog */}
      <Dialog
        open={successDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#1976d2', fontWeight: 600 }}>
          Registration Successful!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your hospital has been registered successfully!
            <br />
            <br />
            <strong>Your Hospital ID is:</strong>
            <Box
              sx={{
                mt: 1,
                p: 2,
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#1976d2',
              }}
            >
              {registeredTenantId}
            </Box>
            <br />
            Please save this Hospital ID. You'll need it to log in.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="contained" color="primary">
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RegisterHospital;

