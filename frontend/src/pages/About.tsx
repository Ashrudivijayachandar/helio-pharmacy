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
  Avatar,
  Container,
} from '@mui/material';
import {
  LocalPharmacy as PharmacyIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

const About: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: '#4285f4',
            mx: 'auto',
            mb: 3,
            fontSize: '2rem'
          }}
        >
          <PharmacyIcon fontSize="large" />
        </Avatar>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            color: '#202124',
            fontWeight: 400,
            letterSpacing: '-0.02em'
          }}
        >
          About Helio Pharmacy
        </Typography>
        <Typography 
          variant="body1" 
          color="#5f6368"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Your trusted healthcare partner, serving the community with quality medicines and professional care.
        </Typography>
      </Box>

      {/* Contact Information */}
      <Card sx={{ mb: 4, border: '1px solid #e8eaed', borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              color: '#202124',
              fontWeight: 400,
              mb: 3
            }}
          >
            Contact Information
          </Typography>
          <List sx={{ '& .MuiListItem-root': { px: 0 } }}>
            <ListItem>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#e8f5e8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PhoneIcon sx={{ color: '#137333' }} />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#202124' }}>
                    Phone
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#5f6368' }}>
                    +91 98765 43210
                  </Typography>
                }
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#e3f2fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EmailIcon sx={{ color: '#1976d2' }} />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#202124' }}>
                    Email
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#5f6368' }}>
                    contact@heliopharmacy.com
                  </Typography>
                }
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#fff3e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LocationIcon sx={{ color: '#f57c00' }} />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#202124' }}>
                    Address
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#5f6368' }}>
                    123 Healthcare Street, Medical District, City - 110001
                  </Typography>
                }
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#f3e5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ScheduleIcon sx={{ color: '#7b1fa2' }} />
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#202124' }}>
                    Hours
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#5f6368' }}>
                    24/7 - Always available for your healthcare needs
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Services */}
      <Card sx={{ border: '1px solid #e8eaed', borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              color: '#202124',
              fontWeight: 400,
              mb: 3
            }}
          >
            Our Services
          </Typography>
          <List sx={{ '& .MuiListItem-root': { px: 0 } }}>
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#202124', mb: 0.5 }}>
                    Prescription Medicines
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#5f6368' }}>
                    Complete range of prescription medications with proper consultation
                  </Typography>
                }
              />
            </ListItem>
            
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#202124', mb: 0.5 }}>
                    Rare Medicine Access
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#5f6368' }}>
                    Specialized medicines and rare drug procurement services
                  </Typography>
                }
              />
            </ListItem>
            
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#202124', mb: 0.5 }}>
                    Digital Health Records
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#5f6368' }}>
                    Secure digital storage of prescriptions and medical history
                  </Typography>
                }
              />
            </ListItem>
            
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#202124', mb: 0.5 }}>
                    Professional Consultation
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#5f6368' }}>
                    Expert pharmacist guidance and medication counseling
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};
export default About;