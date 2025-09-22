/**
 * Navigation bar component
 */

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: '#1976d2',
        color: 'white',
        boxShadow: '0px 2px 8px rgba(25, 118, 210, 0.2)',
      }}
      elevation={0}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 700,
            fontSize: { xs: '1.125rem', md: '1.25rem' },
            color: 'white',
          }}
        >
          Helio Pharmacy Management
        </Typography>
        <LanguageSwitcher />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            color="inherit"
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <NotificationsIcon />
          </IconButton>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              '& .MuiPaper-root': {
                borderRadius: 2,
                mt: 1,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                border: '1px solid',
                borderColor: 'divider',
              },
            }}
          >
            <MenuItem 
              onClick={handleClose}
              sx={{ 
                px: 3, 
                py: 1.5,
                fontWeight: 500,
              }}
            >
              Profile
            </MenuItem>
            <MenuItem 
              onClick={handleClose}
              sx={{ 
                px: 3, 
                py: 1.5,
                fontWeight: 500,
              }}
            >
              Settings
            </MenuItem>
            <MenuItem 
              onClick={handleLogout}
              sx={{ 
                px: 3, 
                py: 1.5,
                fontWeight: 500,
                color: 'error.main',
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;