/**
 * About page - Contact Information for Helio Pharmacy
 */

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      pb: 10
    }}>
      {/* Header */}
      <Box sx={{ 
        backgroundColor: '#ffffff',
        px: 4,
        py: 4,
        borderBottom: '1px solid #e1e4e8'
      }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontWeight: 600, 
            color: '#24292e',
            fontSize: '1.75rem',
            mb: 1,
            textAlign: 'center'
          }}
        >
          Helio Pharmacy
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#586069',
            fontSize: '0.95rem',
            textAlign: 'center',
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          Your trusted healthcare partner providing quality pharmaceutical services and rare medicine access
        </Typography>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ px: 4, py: 4 }}>
        {/* Contact Information Card */}
        <Card sx={{ 
          backgroundColor: '#ffffff',
          border: '1px solid #e1e4e8',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          mb: 3
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h6" 
              component="h2" 
              sx={{ 
                color: '#24292e',
                fontWeight: 600,
                fontSize: '1.25rem',
                mb: 3
              }}
            >
              {t('contact_information')}
            </Typography>
            
            <List sx={{ 
              '& .MuiListItem-root': { 
                px: 0,
                py: 2,
                borderBottom: '1px solid #f6f8fa',
                '&:last-child': { borderBottom: 'none' }
              }
            }}>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 56 }}>
                  <PhoneIcon sx={{ color: '#1976d2', fontSize: '1.5rem' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ 
                      fontWeight: 600, 
                      color: '#24292e',
                      fontSize: '1rem',
                      mb: 0.5
                    }}>
                      +1 (555) 123-4567
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ 
                      color: '#586069',
                      fontSize: '0.875rem'
                    }}>
                      +91 98765 43210
                    </Typography>
                  }
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon sx={{ minWidth: 56 }}>
                  <EmailIcon sx={{ color: '#1976d2', fontSize: '1.5rem' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ 
                      fontWeight: 600, 
                      color: '#24292e',
                      fontSize: '1rem',
                      mb: 0.5
                    }}>
                      {t('email')}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ 
                      color: '#586069',
                      fontSize: '0.875rem'
                    }}>
                      contact@heliopharmacy.com
                    </Typography>
                  }
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon sx={{ minWidth: 56 }}>
                  <LocationIcon sx={{ color: '#1976d2', fontSize: '1.5rem' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ 
                      fontWeight: 600, 
                      color: '#24292e',
                      fontSize: '1rem',
                      mb: 0.5
                    }}>
                      123 Healthcare Street, Medical District, City 12345
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ 
                      color: '#586069',
                      fontSize: '0.875rem'
                    }}>
                      123 Healthcare Street, Medical District, City - 110001
                    </Typography>
                  }
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon sx={{ minWidth: 56 }}>
                  <ScheduleIcon sx={{ color: '#1976d2', fontSize: '1.5rem' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ 
                      fontWeight: 600, 
                      color: '#24292e',
                      fontSize: '1rem',
                      mb: 0.5
                    }}>
                      Hours of Operation
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ 
                      color: '#586069',
                      fontSize: '0.875rem'
                    }}>
                      Available 24/7
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
export default About;