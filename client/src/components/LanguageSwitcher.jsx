import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Box } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Save language preference to localStorage
    localStorage.setItem('language', lng);
  };

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <LanguageIcon sx={{ color: 'white' }} />
      <ButtonGroup
        variant="outlined"
        size="small"
        sx={{
          '& .MuiButton-root': {
            borderColor: 'white',
            color: 'white',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
            },
        },
        }}
      >
        <Button
          onClick={() => changeLanguage('en')}
          variant={i18n.language === 'en' ? 'contained' : 'outlined'}
          sx={{
            minWidth: '60px',
            backgroundColor: i18n.language === 'en' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
          }}
        >
          EN
        </Button>
        <Button
          onClick={() => changeLanguage('hi')}
          variant={i18n.language === 'hi' ? 'contained' : 'outlined'}
          sx={{
            minWidth: '60px',
            backgroundColor: i18n.language === 'hi' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
          }}
        >
          हिं
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default LanguageSwitcher;

