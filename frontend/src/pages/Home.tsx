/**
 * Home page component - Main pharmacy overview
 */

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
        <Typography 
          variant="h1" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700,
            color: 'text.primary',
            mb: 1,
          }}
        >
          {t('welcome')}
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            fontSize: { xs: '1rem', md: '1.125rem' },
            fontWeight: 400,
            maxWidth: 600,
          }}
        >
          {t('overview')}
        </Typography>
      </Box>

      {/* Quick Actions and Info */}
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4}>
        <Box sx={{ flex: 2 }}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  mb: 3,
                }}
              >
                {t('quick_actions')}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <Button 
                  variant="contained" 
                  size="large"
                  href="/prescriptions"
                  sx={{ 
                    flex: 1,
                    py: 2,
                    fontSize: '1rem',
                  }}
                >
                  {t('prescription') || 'Prescriptions'}
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  href="/medicine-stock"
                  sx={{ 
                    flex: 1,
                    py: 2,
                    fontSize: '1rem',
                  }}
                >
                  {t('view_medicine_stock')}
                </Button>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mt: 2 }}>
                <Button 
                  variant="outlined" 
                  size="large"
                  href="/rare-medicines"
                  sx={{ 
                    flex: 1,
                    py: 2,
                    fontSize: '1rem',
                  }}
                >
                  Rare Medicines
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  mb: 3,
                }}
              >
                {t('pharmacy_info')}
              </Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontWeight: 500, 
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.75rem',
                      mb: 0.5,
                    }}
                  >
                    {t('current_branch')}
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      fontWeight: 500,
                      color: 'text.primary',
                    }}
                  >
                    {user?.pharmacy || 'Helio Pharmacy Central'}
                  </Typography>
                </Box>
                <Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontWeight: 500, 
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.75rem',
                      mb: 0.5,
                    }}
                  >
                    {t('your_role')}
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      fontWeight: 500,
                      color: 'text.primary',
                    }}
                  >
                    {user?.role || 'Administrator'}
                  </Typography>
                </Box>
                <Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontWeight: 500, 
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.75rem',
                      mb: 0.5,
                    }}
                  >
                    {t('status')}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="success.main"
                    sx={{ 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: 'success.main',
                        borderRadius: '50%',
                      }}
                    />
                    {t('online_active')}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

export default Home;