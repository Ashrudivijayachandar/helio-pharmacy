/**
 * Home page - Pharmacy Dashboard Overview
 */

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
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

  const quickStats = [
    { label: t('availableMedicines') || 'Available Medicines', value: '1,250', color: '#4285f4' },
    { label: t('lowStockItems') || 'Low Stock Items', value: '12', color: '#ea4335' },
    { label: t('pendingOrders') || 'Pending Orders', value: '8', color: '#34a853' },
    { label: t('expiringSoon') || 'Expiring Soon', value: '5', color: '#fbbc04' },
  ];

  const quickActions = [
    { label: t('view_medicine_stock') || 'Medicine Stock', color: '#4285f4', href: '/medicine-stock' },
    { label: t('prescription') || 'Prescriptions', color: '#34a853', href: '/prescriptions' },
    { label: 'Rare Medicines', color: '#ea4335', href: '/rare-medicines' },
    { label: t('about') || 'About', color: '#fbbc04', href: '/about' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 3, pb: 10 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 400,
              color: '#202124',
              mb: 1
            }}
          >
            {t('welcome') || 'Welcome to Helio Pharmacy'}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#5f6368'
            }}
          >
            {t('overview') || 'Pharmacy management dashboard for healthcare professionals'}
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          onClick={handleLogout}
          sx={{ 
            textTransform: 'none',
            borderColor: '#ea4335',
            color: '#ea4335',
            '&:hover': {
              backgroundColor: '#fce8e6',
              borderColor: '#ea4335',
            }
          }}
        >
          {t('logout') || 'Logout'}
        </Button>
      </Box>

      {/* Quick Stats */}
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          fontWeight: 400,
          color: '#202124'
        }}
      >
        {t('quickOverview') || 'Quick Overview'}
      </Typography>
      
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={3} 
        sx={{ mb: 4 }}
      >
        {quickStats.map((stat, index) => (
          <Card 
            key={index}
            sx={{ 
              flex: 1,
              border: '1px solid #e8eaed',
              borderRadius: 2,
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography 
                variant="h3" 
                component="div" 
                sx={{ 
                  fontWeight: 400, 
                  color: stat.color,
                  mb: 1 
                }}
              >
                {stat.value}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 500,
                  color: '#5f6368'
                }}
              >
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Quick Actions */}
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          fontWeight: 400,
          color: '#202124'
        }}
      >
        {t('quickActions') || 'Quick Actions'}
      </Typography>
      
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={3}
        sx={{ mb: 4 }}
      >
        {quickActions.map((action, index) => (
          <Card 
            key={index}
            component="a"
            href={action.href}
            sx={{ 
              flex: 1,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s ease-in-out',
              border: '1px solid #e8eaed',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderColor: action.color,
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 500,
                  color: action.color,
                }}
              >
                {action.label}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Recent Activity */}
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          fontWeight: 400,
          color: '#202124'
        }}
      >
        {t('recentActivity') || 'Recent Activity'}
      </Typography>
      
      <Card sx={{ border: '1px solid #e8eaed', borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box sx={{ 
              p: 3, 
              backgroundColor: '#e8f5e8', 
              borderRadius: 2,
              border: '1px solid #34a853'
            }}>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5, color: '#202124' }}>
                {t('medicineAdded') || 'Medicine Added'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#5f6368' }}>
                {t('paracetamolAdded') || 'Paracetamol 500mg added to inventory'} - 2 {t('hoursAgo') || 'hours ago'}
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 3, 
              backgroundColor: '#fef7f0', 
              borderRadius: 2,
              border: '1px solid #fbbc04'
            }}>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5, color: '#202124' }}>
                {t('lowStockAlert') || 'Low Stock Alert'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#5f6368' }}>
                {t('amoxicillinLowStock') || 'Amoxicillin running low on stock'} - 4 {t('hoursAgo') || 'hours ago'}
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 3, 
              backgroundColor: '#e3f2fd', 
              borderRadius: 2,
              border: '1px solid #4285f4'
            }}>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5, color: '#202124' }}>
                {t('orderCompleted') || 'Order Completed'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#5f6368' }}>
                {t('orderFor50') || 'Order for 50 units of Aspirin completed'} - 6 {t('hoursAgo') || 'hours ago'}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Home;
