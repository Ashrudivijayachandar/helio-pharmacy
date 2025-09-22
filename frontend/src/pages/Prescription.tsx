/**
 * Prescription page - Manage and view prescriptions
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

interface Prescription {
  id: number;
  patient: string;
  date: string;
  doctor: string;
  status: 'Pending' | 'Processing' | 'Ready' | 'Dispensed';
  medicines: string[];
}

// Mock prescriptions data
const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 1,
    patient: 'John Doe',
    date: '2024-12-20',
    doctor: 'Dr. Smith',
    status: 'Pending',
    medicines: ['Paracetamol 500mg', 'Amoxicillin 250mg']
  },
  {
    id: 2,
    patient: 'Jane Smith',
    date: '2024-12-19',
    doctor: 'Dr. Johnson',
    status: 'Processing',
    medicines: ['Ibuprofen 400mg', 'Aspirin 100mg']
  },
  {
    id: 3,
    patient: 'Bob Wilson',
    date: '2024-12-18',
    doctor: 'Dr. Brown',
    status: 'Ready',
    medicines: ['Metformin 500mg', 'Lisinopril 10mg']
  },
];

const Prescription: React.FC = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    // Load prescriptions (could be from API in real implementation)
    setPrescriptions(MOCK_PRESCRIPTIONS);
  }, []);

  const getStatusColor = (status: Prescription['status']) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Processing':
        return 'info';
      case 'Ready':
        return 'success';
      case 'Dispensed':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleViewPrescriptions = () => {
    navigate('/prescriptions');
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Prescription Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          View and manage prescription orders
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Pending Prescriptions
            </Typography>
            <Typography variant="h4">
              {prescriptions.filter(p => p.status === 'Pending').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Processing
            </Typography>
            <Typography variant="h4">
              {prescriptions.filter(p => p.status === 'Processing').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Ready for Pickup
            </Typography>
            <Typography variant="h4">
              {prescriptions.filter(p => p.status === 'Ready').length}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Recent Prescriptions */}
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">
              Recent Prescriptions
            </Typography>
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={handleViewPrescriptions}
            >
              View All Prescriptions
            </Button>
          </Stack>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Patient</strong></TableCell>
                  <TableCell><strong>Doctor</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Medicines</strong></TableCell>
                  <TableCell align="center"><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prescriptions.slice(0, 5).map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {prescription.patient}
                      </Typography>
                    </TableCell>
                    <TableCell>{prescription.doctor}</TableCell>
                    <TableCell>{prescription.date}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {prescription.medicines.join(', ')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={prescription.status}
                        color={getStatusColor(prescription.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {prescriptions.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No prescriptions found. New prescriptions will appear here.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<ReceiptIcon />}
              onClick={handleViewPrescriptions}
            >
              View All Prescriptions
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/medicine-stock')}
            >
              Check Medicine Stock
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Prescription;