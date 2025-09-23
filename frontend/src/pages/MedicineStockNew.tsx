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
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

interface Medicine {
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  stock: number;
  expiryDate: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  batchNumber?: string;
  description?: string;
}

const CATEGORIES = [
  'Analgesics',
  'Antibiotics',
  'Antacids',
  'Antihistamines',
  'Cardiovascular',
  'Diabetes',
  'Respiratory',
  'Vitamins',
  'Others'
];

const MOCK_MEDICINES: Medicine[] = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    category: 'Analgesics',
    manufacturer: 'Government Medical Corp',
    stock: 500,
    expiryDate: '2026-03-15',
    status: 'in-stock' as const,
    batchNumber: 'PMC2024001',
    description: 'Pain relief and fever reducer'
  },
  {
    id: 2,
    name: 'Amoxicillin 250mg',
    category: 'Antibiotics',
    manufacturer: 'National Pharma Ltd',
    stock: 15,
    expiryDate: '2025-12-20',
    status: 'low-stock' as const,
    batchNumber: 'AMX2024002',
    description: 'Broad-spectrum antibiotic'
  },
  {
    id: 3,
    name: 'Insulin Human 100IU',
    category: 'Diabetes',
    manufacturer: 'Bio-Med Industries',
    stock: 0,
    expiryDate: '2025-08-10',
    status: 'out-of-stock' as const,
    batchNumber: 'INS2024003',
    description: 'Human insulin for diabetes management'
  },
  {
    id: 4,
    name: 'Omeprazole 20mg',
    category: 'Antacids',
    manufacturer: 'Generic Pharma Co',
    stock: 200,
    expiryDate: '2026-01-30',
    status: 'in-stock' as const,
    batchNumber: 'OMP2024004',
    description: 'Proton pump inhibitor'
  },
  {
    id: 5,
    name: 'Aspirin 75mg',
    category: 'Cardiovascular',
    manufacturer: 'Heart Care Pharmaceuticals',
    stock: 300,
    expiryDate: '2025-11-15',
    status: 'in-stock' as const,
    batchNumber: 'ASP2024005',
    description: 'Low-dose aspirin for heart protection'
  },
  {
    id: 6,
    name: 'Cetirizine 10mg',
    category: 'Antihistamines',
    manufacturer: 'Allergy Relief Corp',
    stock: 25,
    expiryDate: '2026-02-28',
    status: 'low-stock' as const,
    batchNumber: 'CET2024006',
    description: 'Antihistamine for allergies'
  },
  {
    id: 7,
    name: 'Vitamin D3 1000IU',
    category: 'Vitamins',
    manufacturer: 'Nutrition Plus Ltd',
    stock: 150,
    expiryDate: '2026-06-30',
    status: 'in-stock' as const,
    batchNumber: 'VTD2024007',
    description: 'Vitamin D supplement'
  },
  {
    id: 8,
    name: 'Salbutamol Inhaler',
    category: 'Respiratory',
    manufacturer: 'Respiratory Solutions',
    stock: 45,
    expiryDate: '2025-10-20',
    status: 'in-stock' as const,
    batchNumber: 'SAL2024008',
    description: 'Bronchodilator for asthma'
  }
];

const MedicineStock: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>(MOCK_MEDICINES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>(MOCK_MEDICINES);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Medicine>>({});
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newMedicine, setNewMedicine] = useState<Partial<Medicine>>({
    name: '',
    category: '',
    manufacturer: '',
    stock: 0,
    expiryDate: '',
    batchNumber: '',
    description: ''
  });

  useEffect(() => {
    const filtered = medicines.filter(medicine =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase())
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
    if (window.confirm('Are you sure you want to remove this medicine from inventory?')) {
      setMedicines(prev => prev.filter(med => med.id !== id));
    }
  };

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.category && newMedicine.manufacturer) {
      const medicine: Medicine = {
        id: Math.max(...medicines.map(m => m.id)) + 1,
        name: newMedicine.name || '',
        category: newMedicine.category || '',
        manufacturer: newMedicine.manufacturer || '',
        stock: newMedicine.stock || 0,
        expiryDate: newMedicine.expiryDate || '',
        status: 'in-stock',
        batchNumber: newMedicine.batchNumber || '',
        description: newMedicine.description || ''
      };
      
      const updatedMedicine = updateMedicineStatus(medicine);
      setMedicines(prev => [...prev, updatedMedicine]);
      setAddDialogOpen(false);
      setNewMedicine({
        name: '',
        category: '',
        manufacturer: '',
        stock: 0,
        expiryDate: '',
        batchNumber: '',
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Medicine Inventory Management
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
        Government Pharmacy - Pharmacist Access
      </Typography>

      <Stack spacing={3}>
        {/* Summary Cards */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Medicines</Typography>
              <Typography variant="h4">{stats.total}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>In Stock</Typography>
              <Typography variant="h4" color="success.main">{stats.inStock}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Low Stock</Typography>
              <Typography variant="h4" color="warning.main">{stats.lowStock}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Out of Stock</Typography>
              <Typography variant="h4" color="error.main">{stats.outOfStock}</Typography>
            </CardContent>
          </Card>
        </Stack>

        {/* Controls */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            placeholder="Search medicines..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddDialogOpen(true)}
            sx={{ minWidth: 180 }}
          >
            Add New Medicine
          </Button>
        </Stack>

        {/* Medicine Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Medicine Inventory ({filteredMedicines.length} items)
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell><strong>Medicine Name</strong></TableCell>
                    <TableCell><strong>Category</strong></TableCell>
                    <TableCell><strong>Manufacturer</strong></TableCell>
                    <TableCell align="center"><strong>Stock Qty</strong></TableCell>
                    <TableCell align="center"><strong>Batch #</strong></TableCell>
                    <TableCell align="center"><strong>Expiry Date</strong></TableCell>
                    <TableCell align="center"><strong>Status</strong></TableCell>
                    <TableCell align="center"><strong>Actions</strong></TableCell>
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
                      
                      <TableCell>
                        {editingId === medicine.id ? (
                          <FormControl size="small" fullWidth>
                            <Select
                              value={editForm.category || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                            >
                              {CATEGORIES.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          medicine.category
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {editingId === medicine.id ? (
                          <TextField
                            value={editForm.manufacturer || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, manufacturer: e.target.value }))}
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          medicine.manufacturer
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
                            value={editForm.batchNumber || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, batchNumber: e.target.value }))}
                            size="small"
                            variant="outlined"
                            sx={{ width: 120 }}
                          />
                        ) : (
                          medicine.batchNumber
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
                                Expires Soon
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
                            <Tooltip title="Save Changes">
                              <IconButton size="small" color="primary" onClick={handleEditSave}>
                                <SaveIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel">
                              <IconButton size="small" color="secondary" onClick={handleEditCancel}>
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        ) : (
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Edit Medicine">
                              <IconButton size="small" color="primary" onClick={() => handleEditStart(medicine)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove Medicine">
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
        <DialogTitle>Add New Medicine to Inventory</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Medicine Name"
                value={newMedicine.name}
                onChange={(e) => setNewMedicine(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newMedicine.category}
                  label="Category"
                  onChange={(e) => setNewMedicine(prev => ({ ...prev, category: e.target.value }))}
                >
                  {CATEGORIES.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Manufacturer"
                value={newMedicine.manufacturer}
                onChange={(e) => setNewMedicine(prev => ({ ...prev, manufacturer: e.target.value }))}
                required
              />
              <TextField
                fullWidth
                label="Batch Number"
                value={newMedicine.batchNumber}
                onChange={(e) => setNewMedicine(prev => ({ ...prev, batchNumber: e.target.value }))}
              />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Stock Quantity"
                type="number"
                value={newMedicine.stock}
                onChange={(e) => setNewMedicine(prev => ({ ...prev, stock: Number(e.target.value) }))}
                inputProps={{ min: 0 }}
                required
              />
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                value={newMedicine.expiryDate}
                onChange={(e) => setNewMedicine(prev => ({ ...prev, expiryDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Stack>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={newMedicine.description}
              onChange={(e) => setNewMedicine(prev => ({ ...prev, description: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMedicine} variant="contained">Add Medicine</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicineStock;