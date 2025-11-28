import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      register_hospital: 'Register New Hospital',
      login: 'Login',
      login_existing: 'Login to Existing Hospital',
      dashboard: 'Dashboard',
      patients: 'Patients',
      hero_title: 'Digitize Your Rural Health Center in Seconds',
      hero_subtitle: 'A comprehensive hospital management system designed for rural healthcare facilities. Manage patients, track vitals, and streamline operations all in one place.',
      key_features: 'Key Features',
      patient_records: 'Patient Records',
      patient_records_desc: 'Manage patient information, medical history, and records securely.',
      vitals_tracking: 'Vitals Tracking',
      vitals_tracking_desc: 'Record and monitor patient vital signs in real-time.',
      pharmacy_management: 'Pharmacy Management',
      pharmacy_management_desc: 'Streamline prescription management and medication tracking.',
    },
  },
  hi: {
    translation: {
      welcome: 'स्वागत हे',
      register_hospital: 'नया अस्पताल पंजीकृत करें',
      login: 'लॉग इन करें',
      login_existing: 'मौजूदा अस्पताल में लॉग इन करें',
      dashboard: 'डैशबोर्ड',
      patients: 'रोगी',
      hero_title: 'सेकंडों में अपने ग्रामीण स्वास्थ्य केंद्र को डिजिटाइज़ करें',
      hero_subtitle: 'ग्रामीण स्वास्थ्य सुविधाओं के लिए डिज़ाइन किया गया एक व्यापक अस्पताल प्रबंधन प्रणाली। रोगियों का प्रबंधन करें, महत्वपूर्ण संकेतों को ट्रैक करें, और सभी कार्यों को एक स्थान पर सुव्यवस्थित करें।',
      key_features: 'मुख्य विशेषताएं',
      patient_records: 'रोगी रिकॉर्ड',
      patient_records_desc: 'रोगी की जानकारी, चिकित्सा इतिहास और रिकॉर्ड को सुरक्षित रूप से प्रबंधित करें।',
      vitals_tracking: 'महत्वपूर्ण संकेत ट्रैकिंग',
      vitals_tracking_desc: 'रोगी के महत्वपूर्ण संकेतों को वास्तविक समय में रिकॉर्ड और निगरानी करें।',
      pharmacy_management: 'फार्मेसी प्रबंधन',
      pharmacy_management_desc: 'पर्चे प्रबंधन और दवा ट्रैकिंग को सुव्यवस्थित करें।',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;

