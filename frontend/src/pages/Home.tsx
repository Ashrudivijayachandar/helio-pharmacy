/**
 * Home page - Pharmacy Dashboard Overview
 */

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 12 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 400,
            color: '#4a5568',
            mb: 2,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          {t('welcome')}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#718096',
            fontSize: '1.1rem',
            lineHeight: 1.5
          }}
        >
          {t('overview')}
        </Typography>
      </Box>

      {/* Main Content - Two Column Layout */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 4, md: 8 },
          alignItems: 'start'
        }}
      >
        {/* Left Column - Quick Actions */}
        <Box>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 500,
              color: '#4a5568',
              mb: 4,
              fontSize: '1.3rem'
            }}
          >
            {t('quick_actions')}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              href="/prescriptions"
              sx={{
                backgroundColor: '#4285f4',
                color: 'white',
                py: 2,
                px: 4,
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(66, 133, 244, 0.2)',
                '&:hover': {
                  backgroundColor: '#3367d6',
                  boxShadow: '0 4px 8px rgba(66, 133, 244, 0.3)',
                }
              }}
            >
              {t('prescription')}
            </Button>
            
            <Button
              variant="outlined"
              href="/medicine-stock"
              sx={{
                borderColor: '#e2e8f0',
                color: '#4a5568',
                py: 2,
                px: 4,
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#f7fafc',
                  borderColor: '#4285f4',
                  color: '#4285f4'
                }
              }}
            >
              {t('view_medicine_stock')}
            </Button>
            
            <Button
              variant="outlined"
              href="/rare-medicines"
              sx={{
                borderColor: '#e2e8f0',
                color: '#4a5568',
                py: 2,
                px: 4,
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#f7fafc',
                  borderColor: '#4285f4',
                  color: '#4285f4'
                }
              }}
            >
              {t('rare_medicines')}
            </Button>
          </Box>
        </Box>

        {/* Right Column - Pharmacy Info */}
        <Box>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 500,
              color: '#4a5568',
              mb: 4,
              fontSize: '1.3rem'
            }}
          >
            {t('pharmacy_info')}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Current Branch */}
            <Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#a0aec0',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  mb: 0.5,
                  display: 'block'
                }}
              >
                {t('current_branch')}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#4a5568',
                  fontSize: '1rem',
                  fontWeight: 500
                }}
              >
                {user?.pharmacy || 'Helio Pharmacy Central'}
              </Typography>
            </Box>

            {/* Your Role */}
            <Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#a0aec0',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  mb: 0.5,
                  display: 'block'
                }}
              >
                {t('your_role')}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#4a5568',
                  fontSize: '1rem',
                  fontWeight: 500
                }}
              >
                {user?.role || 'Administrator'}
              </Typography>
            </Box>

            {/* Status */}
            <Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#a0aec0',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  mb: 0.5,
                  display: 'block'
                }}
              >
                {t('status')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: '#48bb78',
                    borderRadius: '50%',
                  }}
                />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#48bb78',
                    fontSize: '1rem',
                    fontWeight: 500
                  }}
                >
                  {t('online_active')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
