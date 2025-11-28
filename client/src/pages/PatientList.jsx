import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../api/axios';

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Calculate age from date of birth
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

  // Fetch patients with search
  const fetchPatients = async (searchTerm = '') => {
    try {
      setLoading(true);
      setError('');
      const params = searchTerm ? { search: searchTerm } : {};
      const response = await api.get('/patients', { params });

      if (response.data.success) {
        setPatients(response.data.data || []);
      } else {
        setError('Failed to fetch patients');
        toast.error('Failed to fetch patients');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch patients';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = () => {
    fetchPatients(searchInput);
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
    fetchPatients('');
  };

  const columns = [
    {
      field: 'patientId',
      headerName: 'ID',
      width: 200,
      flex: 0,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 250,
      valueGetter: (value, row) => {
        if (!row) return '';
        return `${row.firstName || ''} ${row.lastName || ''}`.trim();
      },
    },
    {
      field: 'age',
      headerName: 'Age',
      width: 100,
      valueGetter: (value, row) => {
        if (!row || !row.dob) return 'N/A';
        return calculateAge(row.dob);
      },
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 120,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 150,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate(`/patients/${params.row._id}`)}
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header with Title and Register Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '2px solid #1976d2' }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: '#1976d2',
              fontWeight: 600,
            }}
          >
            Patient Directory
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/register-patient')}
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            Register New Patient
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Search Patients"
            placeholder="Search by name or Patient ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            sx={{ flexGrow: 1, maxWidth: 400 }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            Search
          </Button>
          {search && (
            <Button variant="outlined" onClick={handleClearSearch} disabled={loading}>
              Clear
            </Button>
          )}
        </Box>

        {search && (
          <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
            Showing results for: "{search}"
          </Typography>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Data Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={patients || []}
              columns={columns}
              pageSizeOptions={[10, 25, 50, 100]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 25 },
                },
              }}
              getRowId={(row) => row?._id || Math.random()}
              disableRowSelectionOnClick
              loading={loading}
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        )}

        {!loading && patients.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {search ? 'No patients found matching your search.' : 'No patients registered yet.'}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PatientList;

