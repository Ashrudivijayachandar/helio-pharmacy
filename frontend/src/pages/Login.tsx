/**
 * Login page component
 */

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Stack,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setLoading(true);
    setError('');

    try {
      await login({ email: userEmail, password: userPassword });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Helio Pharmacy
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
              Sign in to your account
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoFocus
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>

            <Typography variant="body2" align="center" color="textSecondary" sx={{ mt: 2, mb: 1 }}>
              Quick Login:
            </Typography>
            <Stack direction="column" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => quickLogin('admin@heliopharm.com', 'admin123')}
                disabled={loading}
              >
                Login as Administrator
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => quickLogin('pharmacist@heliopharm.com', 'pharma123')}
                disabled={loading}
              >
                Login as Head Pharmacist
              </Button>
            </Stack>

            <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 2 }}>
              <strong>Demo Credentials:</strong>
            </Typography>
            
            <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Administrator:</strong> admin@heliopharm.com / admin123
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Head Pharmacist:</strong> pharmacist@heliopharm.com / pharma123
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Pharmacy Assistant:</strong> assistant@heliopharm.com / assist123
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Pharmacy Manager:</strong> manager@heliopharm.com / manager123
              </Typography>
              <Typography variant="body2">
                <strong>Pharmacy Intern:</strong> intern@heliopharm.com / intern123
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;