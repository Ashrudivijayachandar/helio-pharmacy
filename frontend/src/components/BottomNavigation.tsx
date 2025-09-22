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

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(8px)',
      }}
      elevation={0}
    >
      <BottomNavigation
        value={getNavigationValue()}
        onChange={handleNavigationChange}
        sx={{
          height: isMobile ? 70 : 80,
          backgroundColor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            paddingTop: 1.5,
            paddingBottom: 1,
            transition: 'all 0.2s ease-in-out',
            '&.Mui-selected': {
              color: theme.palette.primary.main,
              '& .MuiSvgIcon-root': {
                transform: 'scale(1.1)',
              },
              '& .MuiBottomNavigationAction-label': {
                fontWeight: 600,
              },
            },
            '&:hover': {
              backgroundColor: 'rgba(108, 117, 125, 0.08)',
              borderRadius: 2,
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            marginTop: 0.5,
            fontWeight: 500,
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          sx={{
            '& .MuiSvgIcon-root': {
              fontSize: isMobile ? '1.5rem' : '1.75rem',
              transition: 'transform 0.2s ease-in-out',
            },
          }}
        />
        <BottomNavigationAction
          label="Medicine Stock"
          icon={<PharmacyIcon />}
          sx={{
            '& .MuiSvgIcon-root': {
              fontSize: isMobile ? '1.5rem' : '1.75rem',
              transition: 'transform 0.2s ease-in-out',
            },
          }}
        />
        <BottomNavigationAction
          label="Prescriptions"
          icon={<ReceiptIcon />}
          sx={{
            '& .MuiSvgIcon-root': {
              fontSize: isMobile ? '1.5rem' : '1.75rem',
              transition: 'transform 0.2s ease-in-out',
            },
          }}
        />
        <BottomNavigationAction
          label="Rare Medicines"
          icon={<RareMedicineIcon />}
          sx={{
            '& .MuiSvgIcon-root': {
              fontSize: isMobile ? '1.5rem' : '1.75rem',
              transition: 'transform 0.2s ease-in-out',
            },
          }}
        />
        <BottomNavigationAction
          label="About"
          icon={<InfoIcon />}
          sx={{
            '& .MuiSvgIcon-root': {
              fontSize: isMobile ? '1.5rem' : '1.75rem',
              transition: 'transform 0.2s ease-in-out',
            },
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;