import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CssBaseline,
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  People as PeopleIcon,
  LocalPharmacy as PharmacyIcon,
  MonitorHeart as VitalsIcon,
} from '@mui/icons-material';
import LanguageSwitcher from '../components/LanguageSwitcher';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      titleKey: 'patient_records',
      descriptionKey: 'patient_records_desc',
      icon: <PeopleIcon sx={{ fontSize: 48, color: '#1976d2' }} />,
    },
    {
      titleKey: 'vitals_tracking',
      descriptionKey: 'vitals_tracking_desc',
      icon: <VitalsIcon sx={{ fontSize: 48, color: '#1976d2' }} />,
    },
    {
      titleKey: 'pharmacy_management',
      descriptionKey: 'pharmacy_management_desc',
      icon: <PharmacyIcon sx={{ fontSize: 48, color: '#1976d2' }} />,
    },
  ];

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container maxWidth="lg" sx={{ py: 8, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Language Switcher - Top Right */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <LanguageSwitcher />
          </Box>

          {/* Hero Section */}
          <Box
            sx={{
              textAlign: 'center',
              mb: 8,
              color: 'white',
            }}
          >
            <HospitalIcon sx={{ fontSize: 80, mb: 2, color: 'white' }} />
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {t('hero_title')}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              {t('hero_subtitle')}
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  backgroundColor: 'white',
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    transform: 'translateY(-2px)',
                    boxShadow: 6,
                  },
                  transition: 'all 0.3s',
                }}
              >
                {t('login_existing')}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/register-hospital')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: 6,
                  },
                  transition: 'all 0.3s',
                }}
              >
                {t('register_hospital')}
              </Button>
            </Box>
          </Box>

          {/* Features Grid */}
          <Box sx={{ mt: 'auto' }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                textAlign: 'center',
                mb: 4,
                color: 'white',
                fontWeight: 600,
              }}
            >
              {t('key_features')}
            </Typography>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      boxShadow: 4,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 8,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          color: '#1976d2',
                          mb: 2,
                        }}
                      >
                        {t(feature.titleKey)}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {t(feature.descriptionKey)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LandingPage;

