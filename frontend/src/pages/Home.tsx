/**
 * Home page - Pharmacy Dashboard Overview
 */

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 12 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 300,
            color: '#202124',
            mb: 2,
            letterSpacing: '-0.5px'
          }}
        >
          Welcome to Helio Pharmacy
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#5f6368',
            fontWeight: 300,
            mb: 4,
            lineHeight: 1.4
          }}
        >
          Your trusted partner in healthcare management
        </Typography>
        
        <Button 
          variant="outlined" 
          onClick={handleLogout}
          sx={{ 
            textTransform: 'none',
            borderColor: '#dadce0',
            color: '#5f6368',
            px: 3,
            py: 1,
            '&:hover': {
              backgroundColor: '#f8f9fa',
              borderColor: '#4285f4',
              color: '#4285f4'
            }
          }}
        >
          {t('logout') || 'Sign Out'}
        </Button>
      </Box>

      {/* Current Status */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 400,
            color: '#202124',
            mb: 3
          }}
        >
          Current Status
        </Typography>
        
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: 4
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 300,
                color: '#4285f4',
                mb: 1
              }}
            >
              1,250
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#5f6368',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.75rem'
              }}
            >
              Available Medicines
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 300,
                color: '#ea4335',
                mb: 1
              }}
            >
              12
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#5f6368',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.75rem'
              }}
            >
              Low Stock
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 300,
                color: '#34a853',
                mb: 1
              }}
            >
              8
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#5f6368',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.75rem'
              }}
            >
              Pending Orders
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 300,
                color: '#fbbc04',
                mb: 1
              }}
            >
              5
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#5f6368',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.75rem'
              }}
            >
              Expiring Soon
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 5, borderColor: '#e8eaed' }} />

      {/* Quick Navigation */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 400,
            color: '#202124',
            mb: 4
          }}
        >
          Quick Navigation
        </Typography>
        
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2
          }}
        >
          <Button
            href="/medicine-stock"
            variant="text"
            sx={{
              py: 2,
              justifyContent: 'flex-start',
              textTransform: 'none',
              color: '#202124',
              fontSize: '1.1rem',
              fontWeight: 400,
              '&:hover': {
                backgroundColor: '#f8f9fa',
                color: '#4285f4'
              }
            }}
          >
            → Medicine Inventory
          </Button>
          
          <Button
            href="/prescriptions"
            variant="text"
            sx={{
              py: 2,
              justifyContent: 'flex-start',
              textTransform: 'none',
              color: '#202124',
              fontSize: '1.1rem',
              fontWeight: 400,
              '&:hover': {
                backgroundColor: '#f8f9fa',
                color: '#4285f4'
              }
            }}
          >
            → Prescriptions
          </Button>
          
          <Button
            href="/rare-medicines"
            variant="text"
            sx={{
              py: 2,
              justifyContent: 'flex-start',
              textTransform: 'none',
              color: '#202124',
              fontSize: '1.1rem',
              fontWeight: 400,
              '&:hover': {
                backgroundColor: '#f8f9fa',
                color: '#4285f4'
              }
            }}
          >
            → Rare Medicines
          </Button>
          
          <Button
            href="/about"
            variant="text"
            sx={{
              py: 2,
              justifyContent: 'flex-start',
              textTransform: 'none',
              color: '#202124',
              fontSize: '1.1rem',
              fontWeight: 400,
              '&:hover': {
                backgroundColor: '#f8f9fa',
                color: '#4285f4'
              }
            }}
          >
            → Contact & About
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 5, borderColor: '#e8eaed' }} />

      {/* Recent Updates */}
      <Box>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 400,
            color: '#202124',
            mb: 3
          }}
        >
          Recent Updates
        </Typography>
        
        <List sx={{ p: 0 }}>
          <ListItem 
            sx={{ 
              px: 0, 
              py: 2,
              borderBottom: '1px solid #f1f3f4'
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#202124' }}>
                    Medicine Stock Updated
                  </Typography>
                  <Chip 
                    label="2 hours ago" 
                    size="small" 
                    sx={{ 
                      backgroundColor: '#e8f5e8',
                      color: '#137333',
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>
              }
              secondary={
                <Typography variant="body2" sx={{ color: '#5f6368' }}>
                  Added 100 units of Paracetamol 500mg to inventory
                </Typography>
              }
            />
          </ListItem>
          
          <ListItem 
            sx={{ 
              px: 0, 
              py: 2,
              borderBottom: '1px solid #f1f3f4'
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#202124' }}>
                    Low Stock Alert
                  </Typography>
                  <Chip 
                    label="4 hours ago" 
                    size="small" 
                    sx={{ 
                      backgroundColor: '#fef7f0',
                      color: '#b06000',
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>
              }
              secondary={
                <Typography variant="body2" sx={{ color: '#5f6368' }}>
                  Amoxicillin stock running low - 15 units remaining
                </Typography>
              }
            />
          </ListItem>
          
          <ListItem 
            sx={{ 
              px: 0, 
              py: 2
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#202124' }}>
                    Order Completed
                  </Typography>
                  <Chip 
                    label="6 hours ago" 
                    size="small" 
                    sx={{ 
                      backgroundColor: '#e3f2fd',
                      color: '#1565c0',
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>
              }
              secondary={
                <Typography variant="body2" sx={{ color: '#5f6368' }}>
                  Successfully fulfilled order for 50 units of Aspirin
                </Typography>
              }
            />
          </ListItem>
        </List>
      </Box>
    </Container>
  );
};

export default Home;
