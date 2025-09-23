/**
 * Main App component with routing and layout
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Import components
import Layout from './components/Layout';
import Home from './pages/Home';
import MedicineStock from './pages/MedicineStock';
import Prescription from './pages/Prescription';
import RareMedicines from './pages/RareMedicines';
import About from './pages/About';

// Import contexts
import { AuthProvider } from './hooks/useAuth';

// Import i18n configuration
import './i18n';

// Create medical theme matching the provided screenshots
const theme = createTheme({
  palette: {
    primary: {
      main: '#4285f4', // Google Blue / Medical Blue
      light: '#66a6ff',
      dark: '#2962ff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#34a853', // Success Green for available items
      light: '#69c86a',
      dark: '#2e7d32',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ea4335', // Error Red for unavailable/busy
      light: '#ff6659',
      dark: '#c62828',
    },
    warning: {
      main: '#fbbc04', // Warning Yellow
      light: '#ffcc02',
      dark: '#f57c00',
    },
    info: {
      main: '#4285f4',
      light: '#66a6ff',
      dark: '#2962ff',
    },
    success: {
      main: '#34a853',
      light: '#69c86a',
      dark: '#2e7d32',
    },
    background: {
      default: '#f8f9fa', // Light gray background
      paper: '#ffffff',
    },
    text: {
      primary: '#202124', // Dark gray for primary text
      secondary: '#5f6368', // Medium gray for secondary text
    },
    grey: {
      50: '#f8f9fa',
      100: '#f1f3f4',
      200: '#e8eaed',
      300: '#dadce0',
      400: '#bdc1c6',
      500: '#9aa0a6',
      600: '#80868b',
      700: '#5f6368',
      800: '#3c4043',
      900: '#202124',
    },
    divider: '#e8eaed',
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 400,
      fontSize: '2.125rem',
      lineHeight: 1.2,
      color: '#202124',
    },
    h2: {
      fontWeight: 400,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      color: '#202124',
    },
    h3: {
      fontWeight: 400,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: '#202124',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      color: '#202124',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.4,
      color: '#202124',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.4,
      color: '#202124',
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#202124',
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: '#5f6368',
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
      color: '#5f6368',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(60, 64, 67, 0.3), 0px 1px 3px rgba(60, 64, 67, 0.15)',
    '0px 1px 2px rgba(60, 64, 67, 0.3), 0px 2px 6px rgba(60, 64, 67, 0.15)',
    '0px 4px 8px rgba(60, 64, 67, 0.15), 0px 2px 3px rgba(60, 64, 67, 0.3)',
    '0px 6px 10px rgba(60, 64, 67, 0.15), 0px 2px 3px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
    '0px 8px 12px rgba(60, 64, 67, 0.15), 0px 4px 4px rgba(60, 64, 67, 0.3)',
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid #e8eaed',
          boxShadow: '0px 1px 2px rgba(60, 64, 67, 0.3), 0px 1px 3px rgba(60, 64, 67, 0.15)',
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          padding: '8px 24px',
          textTransform: 'none',
          fontSize: '0.875rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 1px 2px rgba(66, 133, 244, 0.3), 0px 1px 3px rgba(66, 133, 244, 0.15)',
          },
        },
        outlined: {
          borderColor: '#dadce0',
          color: '#5f6368',
          '&:hover': {
            backgroundColor: '#f8f9fa',
            borderColor: '#dadce0',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontSize: '0.75rem',
        },
        filled: {
          '&.MuiChip-colorPrimary': {
            backgroundColor: '#e8f0fe',
            color: '#1a73e8',
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: '#e6f4ea',
            color: '#137333',
          },
          '&.MuiChip-colorError': {
            backgroundColor: '#fce8e6',
            color: '#d93025',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            '& fieldset': {
              borderColor: '#dadce0',
            },
            '&:hover fieldset': {
              borderColor: '#5f6368',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4285f4',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #e8eaed',
            fontWeight: 500,
            fontSize: '0.75rem',
            color: '#5f6368',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e8eaed',
          fontSize: '0.875rem',
          padding: '12px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 8,
        },
      },
    },
  },
});

// Protected Route component (now always allows access since we auto-login)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Main App component
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/medicine-stock"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MedicineStock />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/prescriptions"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Prescription />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rare-medicines"
              element={
                <ProtectedRoute>
                  <Layout>
                    <RareMedicines />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <Layout>
                    <About />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
