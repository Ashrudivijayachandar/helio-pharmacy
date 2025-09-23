/**
 * Home page - Welcome to Helio Medical Platform
 */

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Avatar,
  Container,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const Home: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 3, pb: 10 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%', 
            backgroundColor: '#4285f4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            H
          </Box>
          <Typography variant="h6" fontWeight={400} color="#202124">
            Helio
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="error"
          size="small"
          sx={{ 
            textTransform: 'none',
            fontSize: '0.875rem',
            borderColor: '#ea4335',
            color: '#ea4335',
            '&:hover': {
              backgroundColor: '#fce8e6',
              borderColor: '#ea4335',
            }
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Welcome Section */}
      <Box sx={{ textAlign: 'center', mb: 6, py: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          fontWeight={400}
          color="#202124"
          mb={2}
        >
          Welcome to Helio
        </Typography>
        <Typography 
          variant="body1" 
          color="#5f6368"
          mb={4}
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Connecting rural patients with doctors through telemedicine
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            sx={{
              borderColor: '#dadce0',
              color: '#5f6368',
              textTransform: 'none',
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#f8f9fa',
                borderColor: '#dadce0',
              }
            }}
          >
            Find Your Doctor
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#4285f4',
              textTransform: 'none',
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#3367d6',
              }
            }}
          >
            My Appointments
          </Button>
        </Box>
      </Box>

      {/* Find Your Doctor Section */}
      <Card sx={{ mb: 4, border: '1px solid #e8eaed' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            fontWeight={400}
            color="#202124"
            mb={3}
            textAlign="center"
          >
            Find Your Doctor
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search doctors..."
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#5f6368' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  displayEmpty
                  defaultValue=""
                  size="medium"
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterIcon sx={{ color: '#5f6368', fontSize: '1.2rem' }} />
                    </InputAdornment>
                  }
                  sx={{
                    '& .MuiSelect-select': {
                      color: '#5f6368',
                    }
                  }}
                >
                  <MenuItem value="">All Specialties</MenuItem>
                  <MenuItem value="cardiology">Cardiology</MenuItem>
                  <MenuItem value="pediatrics">Pediatrics</MenuItem>
                  <MenuItem value="general">General Medicine</MenuItem>
                  <MenuItem value="gynecology">Gynecology</MenuItem>
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Checkbox 
                    sx={{
                      color: '#5f6368',
                      '&.Mui-checked': {
                        color: '#4285f4',
                      }
                    }}
                  />
                }
                label={
                  <Typography variant="body2" color="#5f6368">
                    available only
                  </Typography>
                }
              />
            </Box>
          </Box>

          {/* Doctor Card Example */}
          <Card sx={{ border: '1px solid #e8eaed', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: '#5f6368',
                  }}
                >
                  <PersonIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={400} color="#202124" mb={0.5}>
                    Dr. Rajesh Kumar
                  </Typography>
                  <Typography variant="body2" color="#5f6368" mb={0.5}>
                    Cardiology
                  </Typography>
                  <Typography variant="body2" color="#5f6368" mb={1}>
                    MBBS, MD Cardiology
                  </Typography>
                  <Box sx={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    backgroundColor: '#e6f4ea',
                    color: '#137333',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    mb: 1
                  }}>
                    Available
                  </Box>
                  <Typography variant="body2" color="#5f6368">
                    15 years experience
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Home;
