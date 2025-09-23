import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home as HomeIcon,
  LocalPharmacy as PharmacyIcon,
  Receipt as ReceiptIcon,
  MedicalServices as RareMedicineIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Map paths to navigation values
  const getNavigationValue = () => {
    switch (location.pathname) {
      case '/':
        return 0;
      case '/medicine-stock':
        return 1;
      case '/prescriptions':
        return 2;
      case '/rare-medicines':
        return 3;
      case '/about':
        return 4;
      default:
        return 0;
    }
  };

  const handleNavigationChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/medicine-stock');
        break;
      case 2:
        navigate('/prescriptions');
        break;
      case 3:
        navigate('/rare-medicines');
        break;
      case 4:
        navigate('/about');
        break;
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        borderTop: `1px solid #e8eaed`,
        backgroundColor: '#ffffff',
        boxShadow: '0px -1px 3px rgba(60, 64, 67, 0.15)',
      }}
      elevation={0}
    >
      <BottomNavigation
        value={getNavigationValue()}
        onChange={handleNavigationChange}
        sx={{
          height: 64,
          backgroundColor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            paddingTop: 1,
            paddingBottom: 0.5,
            transition: 'all 0.2s ease-in-out',
            color: '#5f6368',
            '&.Mui-selected': {
              color: '#4285f4',
              '& .MuiSvgIcon-root': {
                transform: 'scale(1.05)',
              },
              '& .MuiBottomNavigationAction-label': {
                fontWeight: 500,
                fontSize: '0.75rem',
              },
            },
            '&:hover': {
              backgroundColor: 'rgba(66, 133, 244, 0.04)',
              borderRadius: 8,
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            marginTop: 0.5,
            fontWeight: 400,
          },
        }}
      >
        <BottomNavigationAction
          label={t('home')}
          icon={<HomeIcon />}
          sx={{
            '& .MuiSvgIcon-root': {
              fontSize: '1.4rem',
              transition: 'transform 0.2s ease-in-out',
            },
          }}
        />
        <BottomNavigationAction
          label={t('medicine_stock')}
          icon={<PharmacyIcon />}
          sx={{
            '& .MuiSvgIcon-root': {
              fontSize: '1.4rem',
              transition: 'transform 0.2s ease-in-out',
            },
          }}
        />
        <BottomNavigationAction
          label={t('prescription')}
          icon={<ReceiptIcon />}
          sx={{
            '& .MuiSvgIcon-root': {
              fontSize: '1.4rem',
              transition: 'transform 0.2s ease-in-out',
            },
          }}
        />
        <BottomNavigationAction
          label={t('rare_medicines')}
          icon={<RareMedicineIcon />}
          sx={{
            '& .MuiSvgIcon-root': {
              fontSize: '1.4rem',
              transition: 'transform 0.2s ease-in-out',
            },
          }}
        />
        <BottomNavigationAction
          label={t('about')}
          icon={<InfoIcon />}
          sx={{
            '& .MuiSvgIcon-root': {
              fontSize: '1.4rem',
              transition: 'transform 0.2s ease-in-out',
            },
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;