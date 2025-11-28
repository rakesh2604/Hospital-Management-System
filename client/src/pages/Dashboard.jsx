import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  CssBaseline,
  Container,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Logout as LogoutIcon,
  LocalHospital as HospitalIcon,
  Today as TodayIcon,
  Assignment as PrescriptionIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import api from '../api/axios';

const DRAWER_WIDTH = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Patients', icon: <PeopleIcon />, path: '/patients' },
];

const COLORS = ['#1976d2', '#42a5f5', '#90caf9'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayPatients: 0,
    pendingPrescriptions: 0,
    patientsByGender: [],
    patientsLast7Days: [],
    recentVitals: [],
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stats/dashboard');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const tenantId = localStorage.getItem('tenantId') || 'Unknown Hospital';

  const drawer = (
    <Box>
      <Toolbar
        sx={{
          backgroundColor: '#1976d2',
          color: 'white',
        }}
      >
        <Typography variant="h6" noWrap component="div">
          HMS
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon sx={{ color: '#1976d2' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // Format date for display (e.g., "Jan 15")
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Hospital Management System
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 1, fontWeight: 600 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
            Welcome, {user.firstName} {user.lastName} ({user.role}) • {tenantId}
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Stat Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ boxShadow: 3, height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography color="text.secondary" gutterBottom variant="body2">
                            Total Patients
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1976d2' }}>
                            {stats.totalPatients}
                          </Typography>
                        </Box>
                        <HospitalIcon sx={{ fontSize: 48, color: '#1976d2', opacity: 0.3 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ boxShadow: 3, height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography color="text.secondary" gutterBottom variant="body2">
                            Today's Admissions
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 600, color: '#42a5f5' }}>
                            {stats.todayPatients}
                          </Typography>
                        </Box>
                        <TodayIcon sx={{ fontSize: 48, color: '#42a5f5', opacity: 0.3 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ boxShadow: 3, height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography color="text.secondary" gutterBottom variant="body2">
                            Total Prescriptions
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 600, color: '#90caf9' }}>
                            {stats.pendingPrescriptions}
                          </Typography>
                        </Box>
                        <PrescriptionIcon sx={{ fontSize: 48, color: '#90caf9', opacity: 0.3 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Charts */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Pie Chart - Patients by Gender */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, boxShadow: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                      Patients by Gender
                    </Typography>
                    {stats.patientsByGender.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={stats.patientsByGender}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ gender, count, percent }) =>
                              `${gender}: ${count} (${(percent * 100).toFixed(0)}%)`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {stats.patientsByGender.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="text.secondary">No data available</Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>

                {/* Bar Chart - Patients Registered (Last 7 Days) */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, boxShadow: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                      Patients Registered (Last 7 Days)
                    </Typography>
                    {stats.patientsLast7Days.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.patientsLast7Days}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={formatDate}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(value) => formatDate(value)}
                            formatter={(value) => [value, 'Patients']}
                          />
                          <Legend />
                          <Bar dataKey="count" fill="#1976d2" name="Patients" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="text.secondary">No data available</Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>

              {/* Recent Vitals */}
              {stats.recentVitals.length > 0 && (
                <Paper sx={{ p: 3, boxShadow: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Recent Vitals
                  </Typography>
                  <Grid container spacing={2}>
                    {stats.recentVitals.map((vital, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                              {vital.patientId?.firstName} {vital.patientId?.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              ID: {vital.patientId?.patientId}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              {vital.bloodPressure && (
                                <Typography variant="body2">
                                  BP: {vital.bloodPressure}
                                </Typography>
                              )}
                              {vital.temperature && (
                                <Typography variant="body2">
                                  Temp: {vital.temperature}
                                </Typography>
                              )}
                              {vital.pulse && (
                                <Typography variant="body2">
                                  Pulse: {vital.pulse} bpm
                                </Typography>
                              )}
                              {vital.spO2 && (
                                <Typography variant="body2">
                                  SpO2: {vital.spO2}%
                                </Typography>
                              )}
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              Recorded: {new Date(vital.createdAt).toLocaleString()}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
