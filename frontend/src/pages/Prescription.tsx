import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  Person as PersonIcon,
  DateRange as DateIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface PrescriptionImage {
  id: number;
  patientName: string;
  uploadDate: string;
  imageUrl: string;
  fileName: string;
  patientAge: number;
  patientGender: string;
  description: string;
}

const MOCK_PRESCRIPTION_IMAGES: PrescriptionImage[] = [
  {
    id: 1,
    patientName: 'John Doe',
    uploadDate: '2025-09-20',
    imageUrl: 'https://via.placeholder.com/300x400/f8f9fa/6c757d?text=Prescription+1',
    fileName: 'prescription_john_doe.jpg',
    patientAge: 45,
    patientGender: 'Male',
    description: 'Prescription for diabetes medication'
  },
  {
    id: 2,
    patientName: 'Priya Singh',
    uploadDate: '2025-09-19',
    imageUrl: 'https://via.placeholder.com/300x400/f8f9fa/6c757d?text=Prescription+2',
    fileName: 'prescription_priya_singh.jpg',
    patientAge: 32,
    patientGender: 'Female',
    description: 'Heart medication prescription'
  },
  {
    id: 3,
    patientName: 'Amit Kumar',
    uploadDate: '2025-09-18',
    imageUrl: 'https://via.placeholder.com/300x400/f8f9fa/6c757d?text=Prescription+3',
    fileName: 'prescription_amit_kumar.jpg',
    patientAge: 28,
    patientGender: 'Male',
    description: 'Blood pressure medication refill'
  },
];

const Prescription: React.FC = () => {
  const { t } = useTranslation();
  const [prescriptionImages, setPrescriptionImages] = useState<PrescriptionImage[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionImage | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setPrescriptionImages(MOCK_PRESCRIPTION_IMAGES);
  }, []);

  const handleViewPrescription = (prescription: PrescriptionImage) => {
    setSelectedPrescription(prescription);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPrescription(null);
  };

  return (
    <Box sx={{ 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      pb: 10
    }}>
      <Box sx={{ 
        backgroundColor: '#ffffff',
        px: 4,
        py: 3,
        borderBottom: '1px solid #e1e4e8'
      }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontWeight: 600, 
            color: '#24292e',
            fontSize: '1.75rem',
            mb: 1
          }}
        >
          {t('prescription_images')}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#586069',
            fontSize: '0.95rem'
          }}
        >
          {t('view_uploaded_prescription_images')}
        </Typography>
      </Box>

      <Box sx={{ px: 4, py: 3 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)', 
            lg: 'repeat(4, 1fr)' 
          },
          gap: 3
        }}>
          {prescriptionImages.map((prescription) => (
            <Card
              key={prescription.id}
              sx={{
                backgroundColor: '#ffffff',
                border: '1px solid #e1e4e8',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: '#f6f8fa',
                    color: '#586069',
                    mx: 'auto',
                    mb: 2,
                    fontSize: '1.5rem'
                  }}
                >
                  <PersonIcon />
                </Avatar>

                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#24292e',
                    fontSize: '1.1rem',
                    mb: 1
                  }}
                >
                  {prescription.patientName}
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: 0.5,
                  mb: 3
                }}>
                  <DateIcon sx={{ fontSize: '1rem', color: '#586069' }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#586069',
                      fontSize: '0.8rem'
                    }}
                  >
                    {prescription.uploadDate}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#28a745',
                    color: '#ffffff',
                    borderRadius: '6px',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    px: 2.5,
                    py: 1.2,
                    minWidth: 110,
                    boxShadow: 'none',
                    border: '1px solid #28a745',
                    '&:active': {
                      transform: 'translateY(1px)',
                    }
                  }}
                  onClick={() => handleViewPrescription(prescription)}
                >
                  {t('view_image')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Prescription View Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '8px',
            maxHeight: '95vh',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogContent sx={{ p: 4, backgroundColor: '#ffffff' }}>
          {selectedPrescription && (
            <Box>
              {/* Header Section */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                mb: 3,
                pb: 2,
                borderBottom: '1px solid #f1f3f4'
              }}>
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#24292e',
                      fontSize: '1.5rem',
                      mb: 0.5
                    }}
                  >
                    {selectedPrescription.patientName}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#6a737d',
                      fontSize: '0.9rem'
                    }}
                  >
                    Patient ID: PAT-{selectedPrescription.id.toString().padStart(3, '0')} • Contact: +91-9876543210
                  </Typography>
                </Box>
                <Button
                  onClick={handleCloseDialog}
                  sx={{
                    color: '#0969da',
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    fontWeight: 500,
                    minWidth: 'auto',
                    px: 2,
                    py: 1,
                    '&:hover': {
                      backgroundColor: '#f6f8fa',
                    }
                  }}
                >
                  {t('close')}
                </Button>
              </Box>

              {/* Prescription Image Section */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  mb: 2 
                }}>
                  <Box sx={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    IMAGE
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#24292e',
                      fontSize: '1.1rem'
                    }}
                  >
                    Prescription Image
                  </Typography>
                </Box>

                <Box sx={{
                  border: '2px dashed #d1d5da',
                  borderRadius: '8px',
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: '2rem' }}>📄</Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#24292e',
                      mb: 1
                    }}
                  >
                    Prescription Image
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#6a737d',
                      fontSize: '0.85rem',
                      mb: 1
                    }}
                  >
                    /images/prescriptions/{selectedPrescription.fileName}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#6a737d',
                      fontSize: '0.85rem'
                    }}
                  >
                    Prescription image for heart medication
                  </Typography>
                </Box>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#6a737d',
                    fontSize: '0.85rem',
                    mt: 1
                  }}
                >
                  <strong>Quantity:</strong> 1
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Prescription;