/**
 * Navigation bar component
 */

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  FavoriteBorder as HeartIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: '#ffffff',
        color: '#24292e',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e1e4e8',
      }}
      elevation={0}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: '64px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <HeartIcon sx={{ fontSize: '1.125rem' }} />
          </Box>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              fontSize: '1.25rem',
              color: '#24292e',
            }}
          >
            Helio
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LanguageSwitcher />
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            variant="outlined"
            sx={{
              color: '#d73a49',
              borderColor: '#d73a49',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              px: 2,
              py: 0.75,
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: '#ffeaea',
                borderColor: '#d73a49',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;