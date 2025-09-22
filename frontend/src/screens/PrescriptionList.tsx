import React from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Card, CardContent, Typography, CardMedia, Chip, Button } from '@mui/material';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const dummyPrescriptions = [
  {
    id: 1,
    patient: 'John Doe',
    date: '2025-09-10',
    status: 'Reviewed',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    patient: 'Priya Singh',
    date: '2025-09-12',
    status: 'Pending',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    patient: 'Amit Kumar',
    date: '2025-09-13',
    status: 'Dispensed',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 4,
    patient: 'Simran Kaur',
    date: '2025-09-14',
    status: 'Processing',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 5,
    patient: 'Rahul Sharma',
    date: '2025-09-15',
    status: 'Cancelled',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 6,
    patient: 'Neha Gupta',
    date: '2025-09-16',
    status: 'Reviewed',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 7,
    patient: 'Manpreet Singh',
    date: '2025-09-17',
    status: 'Pending',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 8,
    patient: 'Anjali Verma',
    date: '2025-09-18',
    status: 'Processing',
    image: 'https://via.placeholder.com/150',
  },
];

const PrescriptionList: React.FC = () => {
  const { t } = useTranslation();
  const [viewOpen, setViewOpen] = React.useState(false);
  const [viewImage, setViewImage] = React.useState<string | null>(null);

  const handleView = (image: string) => {
    setViewImage(image);
    setViewOpen(true);
  };

  const handleClose = () => {
    setViewOpen(false);
    setViewImage(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h4" gutterBottom>
        {t('prescriptions') || 'Prescriptions'}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {dummyPrescriptions.map((prescription) => (
          <Box key={prescription.id} sx={{ flex: '1 1 300px', maxWidth: 400 }}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={prescription.image}
                alt={t('prescription_image') || 'Prescription Image'}
              />
              <CardContent>
                <Typography variant="h6">
                  {t('patient_name') || 'Patient'}: {prescription.patient}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('date') || 'Date'}: {prescription.date}
                </Typography>
                <Chip label={t(prescription.status?.toLowerCase() || '') || prescription.status} color={prescription.status === 'Reviewed' ? 'success' : 'warning'} sx={{ mt: 1 }} />
                <Button variant="outlined" sx={{ mt: 2 }} onClick={() => handleView(prescription.image)}>
                  View
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="md">
        <DialogContent sx={{ position: 'relative', p: 2 }}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>
          {viewImage && (
            <img src={viewImage} alt="Prescription" style={{ maxWidth: '100%', maxHeight: '80vh', display: 'block', margin: '0 auto' }} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrescriptionList;
