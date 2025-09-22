/**
 * Rare Medicines page - Track and order rare medicines from prescriptions
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface PatientMedicineRequest {
  id: number;
  patientId: string;
  patientName: string;
  contactNumber: string;
  email: string;
  requestDate: string;
  medicines: RequestedMedicine[];
  status: 'Pending' | 'Under Review' | 'Available' | 'Ordered' | 'Ready for Pickup' | 'Completed';
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  totalItems: number;
}

interface RequestedMedicine {
  id: number;
  requestType: 'text' | 'image';
  medicineName?: string;
  description?: string;
  imageUrl?: string;
  strength?: string;
  manufacturer?: string;
  quantity: number;
  notes?: string;
  foundInStock: boolean;
  alternativeAvailable?: boolean;
  estimatedCost?: number;
}

// Mock data for patient medicine requests
const MOCK_PATIENT_REQUESTS: PatientMedicineRequest[] = [
  {
    id: 1,
    patientId: 'PAT-001',
    patientName: 'Kavin Kumar',
    contactNumber: '+91-9876543210',
    email: 'kavin.kumar@email.com',
    requestDate: '2024-12-20',
    status: 'Pending',
    urgency: 'High',
    totalItems: 2,
    medicines: [
      {
        id: 101,
        requestType: 'text',
        medicineName: 'Adalimumab 40mg',
        description: 'Injection for rheumatoid arthritis, prescribed by Dr. Smith',
        strength: '40mg/0.8ml',
        manufacturer: 'AbbVie',
        quantity: 4,
        notes: 'Need for monthly treatment',
        foundInStock: false,
        alternativeAvailable: true,
        estimatedCost: 15000
      },
      {
        id: 102,
        requestType: 'image',
        imageUrl: '/images/prescriptions/kavin-prescription-1.jpg',
        description: 'Prescription image for heart medication',
        quantity: 1,
        notes: 'Urgent - running out of current supply',
        foundInStock: false,
        alternativeAvailable: false
      }
    ]
  },
  {
    id: 2,
    patientId: 'PAT-002',
    patientName: 'Priya Sharma',
    contactNumber: '+91-9876543211',
    email: 'priya.sharma@email.com',
    requestDate: '2024-12-19',
    status: 'Under Review',
    urgency: 'Critical',
    totalItems: 1,
    medicines: [
      {
        id: 201,
        requestType: 'text',
        medicineName: 'Pembrolizumab',
        description: 'Cancer immunotherapy injection, prescribed by oncologist',
        strength: '100mg/4ml',
        manufacturer: 'Merck',
        quantity: 1,
        notes: 'Part of chemotherapy treatment cycle',
        foundInStock: false,
        alternativeAvailable: false,
        estimatedCost: 75000
      }
    ]
  },
  {
    id: 3,
    patientId: 'PAT-003',
    patientName: 'Rajesh Gupta',
    contactNumber: '+91-9876543212',
    email: 'rajesh.gupta@email.com',
    requestDate: '2024-12-18',
    status: 'Available',
    urgency: 'Medium',
    totalItems: 3,
    medicines: [
      {
        id: 301,
        requestType: 'image',
        imageUrl: '/images/prescriptions/rajesh-prescription-1.jpg',
        description: 'Prescription for diabetes medication',
        quantity: 2,
        notes: 'Monthly supply needed',
        foundInStock: true,
        alternativeAvailable: true
      },
      {
        id: 302,
        requestType: 'text',
        medicineName: 'Rituximab',
        description: 'Infusion for autoimmune condition',
        strength: '100mg/10ml',
        manufacturer: 'Roche',
        quantity: 1,
        notes: 'Quarterly treatment',
        foundInStock: false,
        alternativeAvailable: true,
        estimatedCost: 25000
      }
    ]
  },
  {
    id: 4,
    patientId: 'PAT-004',
    patientName: 'Anita Desai',
    contactNumber: '+91-9876543213',
    email: 'anita.desai@email.com',
    requestDate: '2024-12-17',
    status: 'Ready for Pickup',
    urgency: 'Low',
    totalItems: 1,
    medicines: [
      {
        id: 401,
        requestType: 'text',
        medicineName: 'Sofosbuvir',
        description: 'Hepatitis C treatment tablet',
        strength: '400mg',
        manufacturer: 'Gilead',
        quantity: 84,
        notes: '12-week treatment course',
        foundInStock: true,
        alternativeAvailable: false,
        estimatedCost: 45000
      }
    ]
  }
];

const RareMedicines: React.FC = () => {
  const [patientRequests, setPatientRequests] = useState<PatientMedicineRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PatientMedicineRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('All');
  const [selectedPatient, setSelectedPatient] = useState<PatientMedicineRequest | null>(null);
  const [patientDetailOpen, setPatientDetailOpen] = useState(false);

  useEffect(() => {
    // Load patient requests (in real app, this would be from API)
    setPatientRequests(MOCK_PATIENT_REQUESTS);
    setFilteredRequests(MOCK_PATIENT_REQUESTS);
  }, []);

  useEffect(() => {
    // Filter requests based on search, status, and urgency
    let filtered = patientRequests;

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.medicines.some(med => 
          med.medicineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    if (urgencyFilter !== 'All') {
      filtered = filtered.filter(request => request.urgency === urgencyFilter);
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, urgencyFilter, patientRequests]);

  const getStatusColor = (status: PatientMedicineRequest['status']) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Under Review':
        return 'info';
      case 'Available':
        return 'success';
      case 'Ordered':
        return 'primary';
      case 'Ready for Pickup':
        return 'success';
      case 'Completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getUrgencyColor = (urgency: PatientMedicineRequest['urgency']) => {
    switch (urgency) {
      case 'Low':
        return 'default';
      case 'Medium':
        return 'info';
      case 'High':
        return 'warning';
      case 'Critical':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusCounts = () => {
    return {
      total: patientRequests.length,
      pending: patientRequests.filter(r => r.status === 'Pending').length,
      underReview: patientRequests.filter(r => r.status === 'Under Review').length,
      available: patientRequests.filter(r => r.status === 'Available').length,
      readyForPickup: patientRequests.filter(r => r.status === 'Ready for Pickup').length,
      critical: patientRequests.filter(r => r.urgency === 'Critical').length,
    };
  };

  const handleViewPatientDetails = (patient: PatientMedicineRequest) => {
    setSelectedPatient(patient);
    setPatientDetailOpen(true);
  };

  const handleUpdateStatus = (requestId: number, newStatus: PatientMedicineRequest['status']) => {
    setPatientRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? { ...request, status: newStatus }
          : request
      )
    );
  };

  const statusCounts = getStatusCounts();

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            letterSpacing: '-0.02em'
          }}
        >
          Patient Medicine Requests
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            fontSize: '1.1rem',
            lineHeight: 1.6,
            maxWidth: 600
          }}
        >
          Patients can request medicines not available in our stock. Search by patient name to view their requests and help them find alternative solutions.
        </Typography>
      </Box>

      {/* Filters and Search */}
      <Card sx={{ 
        mb: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none'
      }}>
        <CardContent sx={{ py: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
            <TextField
              placeholder="Search patients, medicines, or request IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ 
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Under Review">Under Review</MenuItem>
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Ordered">Ordered</MenuItem>
                <MenuItem value="Ready for Pickup">Ready for Pickup</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel>Urgency</InputLabel>
              <Select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                label="Urgency"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </Select>
            </FormControl>
            <IconButton 
              onClick={() => window.location.reload()}
              sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                '&:hover': {
                  borderColor: 'primary.main'
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {statusCounts.critical > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <strong>{statusCounts.critical}</strong> critical rare medicine request(s) need immediate attention!
        </Alert>
      )}

      {/* Patient Requests List */}
      <Card sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              mb: 3
            }}
          >
            Patient Medicine Requests
          </Typography>
          
          <Stack spacing={2}>
            {filteredRequests.map((request) => (
              <Card 
                key={request.id}
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transform: 'translateY(-1px)'
                  }
                }}
                onClick={() => handleViewPatientDetails(request)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            color: 'primary.main',
                            fontSize: '1.1rem'
                          }}
                        >
                          {request.patientName}
                        </Typography>
                        <Chip
                          label={request.urgency}
                          size="small"
                          color={getUrgencyColor(request.urgency)}
                          sx={{ fontWeight: 500 }}
                        />
                      </Stack>
                      
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Patient ID: {request.patientId} • Contact: {request.contactNumber}
                      </Typography>
                      
                      <Typography variant="body2" color="text.primary" mb={2}>
                        {request.totalItems} medicine(s) requested • Request Date: {request.requestDate}
                      </Typography>
                      
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {request.medicines.slice(0, 2).map((medicine, index) => (
                          <Chip
                            key={index}
                            label={medicine.medicineName || `${medicine.requestType} request`}
                            variant="outlined"
                            size="small"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        ))}
                        {request.medicines.length > 2 && (
                          <Chip
                            label={`+${request.medicines.length - 2} more`}
                            variant="outlined"
                            size="small"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        )}
                      </Stack>
                    </Box>
                    
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label={request.status}
                        color={getStatusColor(request.status)}
                        sx={{ 
                          fontWeight: 500,
                          mb: 1
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Click to view details
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>

          {filteredRequests.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No patient requests found matching your criteria.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Patient Detail Dialog */}
      <Dialog 
        open={patientDetailOpen} 
        onClose={() => setPatientDetailOpen(false)} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight={600}>
                {selectedPatient?.patientName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Patient ID: {selectedPatient?.patientId} • Contact: {selectedPatient?.contactNumber}
              </Typography>
            </Box>
            <Chip
              label={selectedPatient?.status}
              color={selectedPatient ? getStatusColor(selectedPatient.status) : 'default'}
              sx={{ fontWeight: 500 }}
            />
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedPatient && (
            <Box sx={{ mt: 1 }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Request Date: {selectedPatient.requestDate} • Urgency: {selectedPatient.urgency} • Total Items: {selectedPatient.totalItems}
              </Alert>
              
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Requested Medicines
              </Typography>
              
              <Stack spacing={3}>
                {selectedPatient.medicines.map((medicine) => (
                  <Card 
                    key={medicine.id}
                    sx={{ 
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" spacing={3}>
                        {/* Request Type Indicator */}
                        <Box sx={{ minWidth: 80 }}>
                          <Chip
                            label={medicine.requestType.toUpperCase()}
                            variant="outlined"
                            color={medicine.requestType === 'text' ? 'primary' : 'secondary'}
                            sx={{ fontWeight: 500 }}
                          />
                        </Box>
                        
                        {/* Medicine Details */}
                        <Box sx={{ flex: 1 }}>
                          {medicine.requestType === 'text' ? (
                            <Box>
                              <Typography variant="h6" fontWeight={600} mb={1}>
                                {medicine.medicineName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" mb={1}>
                                {medicine.strength} • {medicine.manufacturer}
                              </Typography>
                              <Typography variant="body1" mb={2}>
                                {medicine.description}
                              </Typography>
                              <Stack direction="row" spacing={2} mb={1}>
                                <Typography variant="body2">
                                  <strong>Quantity:</strong> {medicine.quantity}
                                </Typography>
                                {medicine.estimatedCost && (
                                  <Typography variant="body2">
                                    <strong>Est. Cost:</strong> ₹{medicine.estimatedCost}
                                  </Typography>
                                )}
                              </Stack>
                            </Box>
                          ) : (
                            <Box>
                              <Typography variant="h6" fontWeight={600} mb={2}>
                                Prescription Image
                              </Typography>
                              <Box 
                                sx={{ 
                                  border: '2px dashed',
                                  borderColor: 'grey.300',
                                  borderRadius: 2,
                                  p: 3,
                                  textAlign: 'center',
                                  backgroundColor: 'grey.50'
                                }}
                              >
                                <Typography variant="body1" color="text.secondary" mb={1}>
                                  📷 Prescription Image
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {medicine.imageUrl}
                                </Typography>
                                <Typography variant="body2" mt={1}>
                                  {medicine.description}
                                </Typography>
                              </Box>
                              <Typography variant="body2" mt={1}>
                                <strong>Quantity:</strong> {medicine.quantity}
                              </Typography>
                            </Box>
                          )}
                          
                          {medicine.notes && (
                            <Typography variant="body2" color="text.secondary" mt={1}>
                              <strong>Notes:</strong> {medicine.notes}
                            </Typography>
                          )}
                          
                          {/* Availability Status */}
                          <Stack direction="row" spacing={2} mt={2}>
                            <Chip
                              label={medicine.foundInStock ? 'In Stock' : 'Not in Stock'}
                              color={medicine.foundInStock ? 'success' : 'error'}
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                            {medicine.alternativeAvailable && (
                              <Chip
                                label="Alternative Available"
                                color="info"
                                variant="outlined"
                                size="small"
                                sx={{ fontWeight: 500 }}
                              />
                            )}
                          </Stack>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPatientDetailOpen(false)}>
            Close
          </Button>
          {selectedPatient?.status === 'Pending' && (
            <Button
              variant="contained"
              onClick={() => {
                if (selectedPatient) {
                  handleUpdateStatus(selectedPatient.id, 'Under Review');
                }
                setPatientDetailOpen(false);
              }}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Mark Under Review
            </Button>
          )}
          {selectedPatient?.status === 'Under Review' && (
            <Button
              variant="contained"
              onClick={() => {
                if (selectedPatient) {
                  handleUpdateStatus(selectedPatient.id, 'Available');
                }
                setPatientDetailOpen(false);
              }}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Mark Available
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RareMedicines;