import { forwardRef } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material';

const PrescriptionPrint = forwardRef(({ prescription, patient, hospitalName }, ref) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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

  return (
    <Box
      ref={ref}
      sx={{
        display: 'none',
        '@media print': {
          display: 'block',
          width: '210mm',
          minHeight: '297mm',
          padding: '20mm',
          backgroundColor: 'white',
          color: 'black',
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          backgroundColor: 'white',
          color: 'black',
          '@media print': {
            boxShadow: 'none',
          },
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'black',
              mb: 1,
              fontSize: '24px',
            }}
          >
            {hospitalName || 'Hospital'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'black', mb: 2 }}>
            PRESCRIPTION
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'black' }} />
        </Box>

        {/* Date and Prescription ID */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'black', fontWeight: 600 }}>
              Date: {formatDate(prescription.createdAt)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: 'black', fontWeight: 600 }}>
              Prescription ID: {prescription.prescriptionId}
            </Typography>
          </Box>
        </Box>

        {/* Patient Information */}
        <Box sx={{ mb: 4, border: '1px solid black', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'black' }}>
            Patient Information
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Typography variant="body2" sx={{ color: 'black' }}>
                <strong>Name:</strong> {patient?.firstName} {patient?.lastName}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'black' }}>
                <strong>Patient ID:</strong> {patient?.patientId}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'black' }}>
                <strong>Age:</strong> {calculateAge(patient?.dob)} years
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'black' }}>
                <strong>Gender:</strong> {patient?.gender}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Diagnosis */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'black' }}>
            Diagnosis
          </Typography>
          <Typography variant="body1" sx={{ color: 'black', pl: 2 }}>
            {prescription.diagnosis}
          </Typography>
        </Box>

        {/* Medicines Table */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'black' }}>
            Prescribed Medicines
          </Typography>
          <TableContainer>
            <Table sx={{ border: '1px solid black' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell
                    sx={{
                      border: '1px solid black',
                      fontWeight: 700,
                      color: 'black',
                      fontSize: '12px',
                    }}
                  >
                    Medicine Name
                  </TableCell>
                  <TableCell
                    sx={{
                      border: '1px solid black',
                      fontWeight: 700,
                      color: 'black',
                      fontSize: '12px',
                    }}
                  >
                    Dosage
                  </TableCell>
                  <TableCell
                    sx={{
                      border: '1px solid black',
                      fontWeight: 700,
                      color: 'black',
                      fontSize: '12px',
                    }}
                  >
                    Frequency
                  </TableCell>
                  <TableCell
                    sx={{
                      border: '1px solid black',
                      fontWeight: 700,
                      color: 'black',
                      fontSize: '12px',
                    }}
                  >
                    Duration
                  </TableCell>
                  <TableCell
                    sx={{
                      border: '1px solid black',
                      fontWeight: 700,
                      color: 'black',
                      fontSize: '12px',
                    }}
                  >
                    Instructions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prescription.medicines.map((medicine, index) => (
                  <TableRow key={index}>
                    <TableCell
                      sx={{
                        border: '1px solid black',
                        color: 'black',
                        fontSize: '12px',
                      }}
                    >
                      {medicine.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: '1px solid black',
                        color: 'black',
                        fontSize: '12px',
                      }}
                    >
                      {medicine.dosage}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: '1px solid black',
                        color: 'black',
                        fontSize: '12px',
                      }}
                    >
                      {medicine.frequency}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: '1px solid black',
                        color: 'black',
                        fontSize: '12px',
                      }}
                    >
                      {medicine.duration}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: '1px solid black',
                        color: 'black',
                        fontSize: '12px',
                      }}
                    >
                      {medicine.instructions || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Footer - Doctor Signature */}
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ color: 'black', mb: 4 }}>
              Prescribed by:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: 'black' }}>
              Dr. {prescription.doctorId?.firstName} {prescription.doctorId?.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'black', mt: 1 }}>
              {prescription.doctorId?.role}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'right' }}>
            <Box
              sx={{
                borderTop: '1px solid black',
                width: '200px',
                ml: 'auto',
                mt: 4,
                pt: 1,
              }}
            >
              <Typography variant="body2" sx={{ color: 'black' }}>
                Doctor's Signature
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Footer Note */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'black', fontStyle: 'italic' }}>
            This is a computer-generated prescription. Please consult your doctor for any queries.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
});

PrescriptionPrint.displayName = 'PrescriptionPrint';

export default PrescriptionPrint;

