/**
 * Medicine Stock page - Pharmacist Access with Full Editing Capabilities
 * Government Pharmacy - No pricing information needed
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Alert,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Container,
} from '@mui/material';
import {
  Search as SearchIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface Medicine {
  id: number;
  name: string;
  stock: number;
  expiryDate: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  description?: string;
}

const MOCK_MEDICINES: Medicine[] = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    stock: 500,
    expiryDate: '2026-03-15',
    status: 'in-stock' as const,
    description: 'Pain relief and fever reducer'
  },
  {
    id: 2,
    name: 'Amoxicillin 250mg',
    stock: 15,
    expiryDate: '2025-12-20',
    status: 'low-stock' as const,
    description: 'Broad-spectrum antibiotic'
  },
  {
    id: 3,
    name: 'Insulin Human 100IU',
    stock: 0,
    expiryDate: '2025-08-10',
    status: 'out-of-stock' as const,
    description: 'Human insulin for diabetes management'
  },
  {
    id: 4,
    name: 'Omeprazole 20mg',
    stock: 200,
    expiryDate: '2026-01-30',
    status: 'in-stock' as const,
    description: 'Proton pump inhibitor'
  },
  {
    id: 5,
    name: 'Aspirin 75mg',
    stock: 300,
    expiryDate: '2025-11-15',
    status: 'in-stock' as const,
    description: 'Low-dose aspirin for heart protection'
  },
  {
    id: 6,
    name: 'Cetirizine 10mg',
    stock: 25,
    expiryDate: '2026-02-28',
    status: 'low-stock' as const,
    description: 'Antihistamine for allergies'
  },
  {
    id: 7,
    name: 'Vitamin D3 1000IU',
    stock: 150,
    expiryDate: '2026-06-30',
    status: 'in-stock' as const,
    description: 'Vitamin D supplement'
  },
  {
    id: 8,
    name: 'Salbutamol Inhaler',
    stock: 45,
    expiryDate: '2025-10-20',
    status: 'in-stock' as const,
    description: 'Bronchodilator for asthma'
  }
];

const MedicineStock: React.FC = () => {
  const { t } = useTranslation();
  const [medicines, setMedicines] = useState<Medicine[]>(MOCK_MEDICINES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>(MOCK_MEDICINES);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Medicine>>({});
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newMedicine, setNewMedicine] = useState<Partial<Medicine>>({
    name: '',
    stock: 0,
    expiryDate: '',
    description: ''
  });

  useEffect(() => {
    const filtered = medicines.filter(medicine =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMedicines(filtered);
  }, [searchTerm, medicines]);

  const updateMedicineStatus = (medicine: Medicine): Medicine => {
    let status: 'in-stock' | 'low-stock' | 'out-of-stock';
    if (medicine.stock === 0) {
      status = 'out-of-stock';
    } else if (medicine.stock <= 30) {
      status = 'low-stock';
    } else {
      status = 'in-stock';
    }
    return { ...medicine, status };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'success';
      case 'low-stock':
        return 'warning';
      case 'out-of-stock':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleEditStart = (medicine: Medicine) => {
    setEditingId(medicine.id);
    setEditForm(medicine);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditSave = () => {
    if (editingId && editForm) {
      const updatedMedicine = updateMedicineStatus(editForm as Medicine);
      setMedicines(prev => 
        prev.map(med => med.id === editingId ? updatedMedicine : med)
      );
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t('confirm_delete'))) {
      setMedicines(prev => prev.filter(med => med.id !== id));
    }
  };

  const handleAddMedicine = () => {
    if (newMedicine.name) {
      const medicine: Medicine = {
        id: Math.max(...medicines.map(m => m.id)) + 1,
        name: newMedicine.name || '',
        stock: newMedicine.stock || 0,
        expiryDate: newMedicine.expiryDate || '',
        status: 'in-stock',
        description: newMedicine.description || ''
      };
      
      const updatedMedicine = updateMedicineStatus(medicine);
      setMedicines(prev => [...prev, updatedMedicine]);
      setAddDialogOpen(false);
      setNewMedicine({
        name: '',
        stock: 0,
        expiryDate: '',
        description: ''
      });
    }
  };

  const stats = {
    total: medicines.length,
    inStock: medicines.filter(m => m.status === 'in-stock').length,
    lowStock: medicines.filter(m => m.status === 'low-stock').length,
    outOfStock: medicines.filter(m => m.status === 'out-of-stock').length,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3, pb: 10 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1"
          gutterBottom 
          sx={{ 
            fontWeight: 400, 
            color: '#202124',
            mb: 1
          }}
        >
          {t('medicine_inventory_management') || 'Medicine Inventory'}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#5f6368',
            maxWidth: 600
          }}
        >
          {t('government_pharmacy_pharmacist_access') || 'Manage and track medicine stock levels with real-time updates'}
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Controls */}
        <Card sx={{ border: '1px solid #e8eaed', borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField
                placeholder={t('search_medicines') || 'Search medicines...'}
                variant="outlined"
                size="medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ 
                  flexGrow: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#dadce0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4285f4',
                    },
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#5f6368' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddDialogOpen(true)}
                sx={{ 
                  minWidth: 180,
                  backgroundColor: '#4285f4',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#3367d6',
                  }
                }}
              >
                {t('add_new_medicine') || 'Add Medicine'}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Alerts */}
        {stats.lowStock > 0 && (
          <Alert 
            severity="warning" 
            icon={<WarningIcon />}
            sx={{
              border: '1px solid #fdd835',
              borderRadius: 2,
              backgroundColor: '#fffbf0',
            }}
          >
            <strong>{stats.lowStock} {t('medicines') || 'medicines'}</strong> {t('running_low_stock') || 'running low on stock'}
          </Alert>
        )}
        
        {stats.outOfStock > 0 && (
          <Alert 
            severity="error" 
            icon={<ErrorIcon />}
            sx={{
              border: '1px solid #f44336',
              borderRadius: 2,
              backgroundColor: '#fef7f7',
            }}
          >
            <strong>{stats.outOfStock} {t('medicines') || 'medicines'}</strong> {t('out_of_stock_alert') || 'are out of stock'}
          </Alert>
        )}

        {/* Medicine Table */}
        <Card sx={{ border: '1px solid #e8eaed', borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #e8eaed' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 400, 
                  color: '#202124' 
                }}
              >
                {t('medicine_inventory') || 'Medicine Inventory'} ({filteredMedicines.length} {t('items') || 'items'})
              </Typography>
            </Box>
            <TableContainer 
              component={Paper} 
              sx={{ 
                boxShadow: 'none',
                border: 'none'
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ 
                    backgroundColor: '#f8f9fa',
                    '& .MuiTableCell-head': {
                      borderBottom: '1px solid #e8eaed',
                      color: '#5f6368',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                    }
                  }}>
                    <TableCell>{t('medicine_name') || 'Medicine Name'}</TableCell>
                    <TableCell align="center">{t('stock_qty') || 'Stock Quantity'}</TableCell>
                    <TableCell align="center">{t('expiry_date') || 'Expiry Date'}</TableCell>
                    <TableCell align="center">{t('status') || 'Status'}</TableCell>
                    <TableCell align="center">{t('actions') || 'Actions'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMedicines.map((medicine) => (
                    <TableRow key={medicine.id} hover>
                      <TableCell>
                        {editingId === medicine.id ? (
                          <TextField
                            value={editForm.name || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {medicine.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {medicine.description}
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      
                      <TableCell align="center">
                        {editingId === medicine.id ? (
                          <TextField
                            type="number"
                            value={editForm.stock || 0}
                            onChange={(e) => setEditForm(prev => ({ ...prev, stock: Number(e.target.value) }))}
                            size="small"
                            variant="outlined"
                            inputProps={{ min: 0 }}
                            sx={{ width: 80 }}
                          />
                        ) : (
                          <Typography 
                            variant="body2" 
                            fontWeight="bold"
                            color={medicine.stock === 0 ? 'error.main' : medicine.stock <= 30 ? 'warning.main' : 'text.primary'}
                          >
                            {medicine.stock}
                          </Typography>
                        )}
                      </TableCell>
                      
                      <TableCell align="center">
                        {editingId === medicine.id ? (
                          <TextField
                            type="date"
                            value={editForm.expiryDate || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                            size="small"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                          />
                        ) : (
                          <Box>
                            <Typography variant="body2">
                              {new Date(medicine.expiryDate).toLocaleDateString()}
                            </Typography>
                            {new Date(medicine.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) && (
                              <Typography variant="caption" color="warning.main">
                                {t('expires_soon')}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </TableCell>
                      
                      <TableCell align="center">
                        <Chip
                          label={medicine.status.replace('-', ' ').toUpperCase()}
                          color={getStatusColor(medicine.status) as any}
                          size="small"
                        />
                      </TableCell>
                      
                      <TableCell align="center">
                        {editingId === medicine.id ? (
                          <Stack direction="row" spacing={1}>
                            <Tooltip title={t('save_changes')}>
                              <IconButton size="small" color="primary" onClick={handleEditSave}>
                                <SaveIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('cancel')}>
                              <IconButton size="small" color="secondary" onClick={handleEditCancel}>
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        ) : (
                          <Stack direction="row" spacing={1}>
                            <Tooltip title={t('edit_medicine')}>
                              <IconButton size="small" color="primary" onClick={() => handleEditStart(medicine)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('remove_medicine')}>
                              <IconButton size="small" color="error" onClick={() => handleDelete(medicine.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Stack>

      {/* Add Medicine Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('add_new_medicine_to_inventory')}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label={t('medicine_name')}
              value={newMedicine.name}
              onChange={(e) => setNewMedicine(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label={t('stock_quantity')}
                type="number"
                value={newMedicine.stock}
                onChange={(e) => setNewMedicine(prev => ({ ...prev, stock: Number(e.target.value) }))}
                inputProps={{ min: 0 }}
                required
              />
              <TextField
                fullWidth
                label={t('expiry_date')}
                type="date"
                value={newMedicine.expiryDate}
                onChange={(e) => setNewMedicine(prev => ({ ...prev, expiryDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Stack>
            <TextField
              fullWidth
              label={t('description')}
              multiline
              rows={2}
              value={newMedicine.description}
              onChange={(e) => setNewMedicine(prev => ({ ...prev, description: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>{t('cancel')}</Button>
          <Button onClick={handleAddMedicine} variant="contained">{t('add_medicine')}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicineStock;