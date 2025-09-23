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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface PatientMedicineRequest {
  id: number;
  patientId: string;
  patientName: string;
  contactNumber: string;
  email: string;
  requestDate: string;
  medicines: RequestedMedicine[];
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
  const { t } = useTranslation();
  const [patientRequests, setPatientRequests] = useState<PatientMedicineRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PatientMedicineRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientMedicineRequest | null>(null);
  const [patientDetailOpen, setPatientDetailOpen] = useState(false);

  useEffect(() => {
    // Load patient requests (in real app, this would be from API)
    setPatientRequests(MOCK_PATIENT_REQUESTS);
    setFilteredRequests(MOCK_PATIENT_REQUESTS);
  }, []);

  useEffect(() => {
    // Filter requests based on search
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

    setFilteredRequests(filtered);
  }, [searchTerm, patientRequests]);

  const handleViewPatientDetails = (patient: PatientMedicineRequest) => {
    setSelectedPatient(patient);
    setPatientDetailOpen(true);
  };

  return (
    <Box sx={{ p: 4, pb: 12, maxWidth: 1200, mx: 'auto' }}>
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 600,
            color: '#24292e',
            mb: 2,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          {t('rare_medicine_requests')}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#586069',
            fontSize: '1.1rem',
            lineHeight: 1.5,
            maxWidth: 800
          }}
        >
          {t('patient_requests_description')}
        </Typography>
      </Box>

      {/* Search Section */}
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600,
            color: '#24292e',
            mb: 3,
            fontSize: '1.3rem'
          }}
        >
          Search Requests
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex',
            gap: 2,
            alignItems: 'end',
            maxWidth: 500
          }}
        >
          <TextField
            placeholder={t('search_patient_requests')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0969da',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0969da',
                }
              }
            }}
          />
        </Box>
      </Box>

      {/* Patient Requests */}
      <Box>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600,
            color: '#24292e',
            mb: 3,
            fontSize: '1.3rem'
          }}
        >
          Patient Requests
        </Typography>
        
        <Box 
          sx={{ 
            display: 'grid',
            gap: 3
          }}
        >
          {filteredRequests.length === 0 ? (
            <Box 
              sx={{ 
                textAlign: 'center',
                py: 8,
                color: '#586069'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 400, mb: 1 }}>
                No requests found
              </Typography>
              <Typography variant="body2">
                Try adjusting your search
              </Typography>
            </Box>
          ) : (
            filteredRequests.map((request) => (
              <Box
                key={request.id}
                sx={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e1e4e8',
                  borderRadius: '8px',
                  p: 4,
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#0969da',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 8px rgba(9, 105, 218, 0.1)',
                  },
                }}
                onClick={() => handleViewPatientDetails(request)}
              >
                <Box 
                  sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '2fr 1fr auto' },
                    gap: { xs: 2, md: 3 },
                    alignItems: 'center'
                  }}
                >
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#24292e',
                        mb: 0.5,
                        fontSize: '1.1rem'
                      }}
                    >
                      {request.patientName}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#586069',
                        mb: 1
                      }}
                    >
                      ID: {request.patientId} • {request.contactNumber}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#6a737d',
                        fontSize: '0.85rem'
                      }}
                    >
                      {request.totalItems} medicine(s) • {request.requestDate}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#6a737d',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontSize: '0.75rem',
                        mb: 0.5
                      }}
                    >
                      Medicines
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {request.medicines.slice(0, 2).map((medicine, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          sx={{ 
                            color: '#24292e',
                            fontSize: '0.8rem',
                            fontWeight: 500
                          }}
                        >
                          {medicine.medicineName || `${medicine.requestType} request`}
                          {index < Math.min(request.medicines.length - 1, 1) && ','}
                        </Typography>
                      ))}
                      {request.medicines.length > 2 && (
                        <Typography
                          variant="body2"
                          sx={{ 
                            color: '#586069',
                            fontSize: '0.8rem'
                          }}
                        >
                          +{request.medicines.length - 2} more
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  <IconButton
                    sx={{ 
                      color: '#586069',
                      '&:hover': {
                        backgroundColor: '#f6f8fa',
                      }
                    }}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>

      {/* Patient Detail Dialog */}
      <Dialog 
        open={patientDetailOpen} 
        onClose={() => setPatientDetailOpen(false)} 
        maxWidth="md" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '8px',
            backgroundColor: '#ffffff'
          }
        }}
      >
        <DialogContent sx={{ p: 4 }}>
          {selectedPatient && (
            <Box>
              {/* Header */}
              <Box sx={{ 
                mb: 3,
                pb: 2,
                borderBottom: '1px solid #e1e4e8'
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#0969da',
                    mb: 0.5
                  }}
                >
                  {selectedPatient.patientName}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#6a737d'
                  }}
                >
                  Patient ID: {selectedPatient.patientId} • Contact: {selectedPatient.contactNumber}
                </Typography>
              </Box>
              
              {/* Medicine Names */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#24292e',
                    mb: 2
                  }}
                >
                  Requested Medicines
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {selectedPatient.medicines.map((medicine, index) => (
                    <Box
                      key={medicine.id}
                      sx={{
                        p: 2,
                        border: '1px solid #d0d7de',
                        borderRadius: '6px',
                        backgroundColor: '#f6f8fa',
                        borderLeft: '3px solid #0969da'
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 500,
                          color: '#24292e',
                          fontSize: '0.95rem'
                        }}
                      >
                        {medicine.medicineName || `Prescription Image ${index + 1}`}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#6a737d',
                          fontSize: '0.85rem',
                          mt: 0.5
                        }}
                      >
                        Quantity: {medicine.quantity}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setPatientDetailOpen(false)}
            sx={{
              color: '#0969da',
              textTransform: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#f6f8fa',
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RareMedicines;