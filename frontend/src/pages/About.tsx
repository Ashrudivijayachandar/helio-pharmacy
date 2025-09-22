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
    <Box sx={{ flexGrow: 1, p: 3, maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'primary.main',
            mx: 'auto',
            mb: 3,
            fontSize: '2rem'
          }}
        >
          <PharmacyIcon fontSize="large" />
        </Avatar>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            color: 'primary.main',
            fontWeight: 600,
            letterSpacing: '-0.02em'
          }}
        >
          Helio Pharmacy
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ 
            fontWeight: 400,
            lineHeight: 1.5
          }}
        >
          Professional Healthcare Services
        </Typography>
      </Box>

      {/* Contact Information */}
      <Card 
        sx={{ 
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              color: 'primary.main',
              fontWeight: 600,
              mb: 3
            }}
          >
            Contact Information
          </Typography>
          <List sx={{ pt: 0 }}>
            <ListItem sx={{ px: 0, py: 2 }}>
              <ListItemIcon>
                <LocationIcon color="primary" sx={{ fontSize: 28 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight={500}>
                    Address
                  </Typography>
                }
                secondary={
                  <Typography variant="body1" color="text.primary" sx={{ mt: 0.5 }}>
                    123 Healthcare Street, Medical District, City 12345
                  </Typography>
                }
              />
            </ListItem>
            <ListItem sx={{ px: 0, py: 2 }}>
              <ListItemIcon>
                <PhoneIcon color="primary" sx={{ fontSize: 28 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight={500}>
                    Phone
                  </Typography>
                }
                secondary={
                  <Typography variant="body1" color="text.primary" sx={{ mt: 0.5 }}>
                    +1 (555) 123-4567
                  </Typography>
                }
              />
            </ListItem>
            <ListItem sx={{ px: 0, py: 2 }}>
              <ListItemIcon>
                <EmailIcon color="primary" sx={{ fontSize: 28 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight={500}>
                    Email
                  </Typography>
                }
                secondary={
                  <Typography variant="body1" color="text.primary" sx={{ mt: 0.5 }}>
                    info@heliopharmacy.com
                  </Typography>
                }
              />
            </ListItem>
            <ListItem sx={{ px: 0, py: 2 }}>
              <ListItemIcon>
                <ScheduleIcon color="primary" sx={{ fontSize: 28 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight={500}>
                    Operating Hours
                  </Typography>
                }
                secondary={
                  <Typography variant="body1" color="text.primary" sx={{ mt: 0.5 }}>
                    Open 24/7 - Available Full Time
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default About;