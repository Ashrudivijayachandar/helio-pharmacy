import React from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import Navbar from './Navbar';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <Navbar />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingTop: isMobile ? 10 : 12, // Space for navbar (64px + padding)
          paddingBottom: isMobile ? 10 : 12, // Space for bottom navigation
          backgroundColor: 'background.default',
          minHeight: 'calc(100vh - 64px)', // Subtract navbar height
        }}
      >
        <Container 
          maxWidth={false}
          sx={{ 
            height: '100%',
            maxWidth: '1400px',
            paddingX: 0, // Remove container padding, let components handle their own
          }}
        >
          {children}
        </Container>
      </Box>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </Box>
  );
};

export default Layout;