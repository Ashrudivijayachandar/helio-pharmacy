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
  Container,
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
    <Box sx={{ 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      pb: 10
    }}>
      {/* Header */}
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
          Medicines Inventory
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#586069',
            fontSize: '0.95rem'
          }}
        >
          Real-time medicine stock and availability
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ px: 4, py: 3 }}>
        {/* Search Section */}
        <Box sx={{ 
          backgroundColor: '#ffffff',
          borderRadius: '6px',
          border: '1px solid #e1e4e8',
          p: 3,
          mb: 3
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 500,
                color: '#24292e',
                fontSize: '1rem'
              }}
            >
              Search medicines
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddDialogOpen(true)}
              sx={{
                backgroundColor: '#28a745',
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: '6px',
                '&:hover': {
                  backgroundColor: '#218838',
                },
              }}
            >
              Add Medicine
            </Button>
          </Box>
          <TextField
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f6f8fa',
                borderRadius: '6px',
                border: '1px solid #e1e4e8',
                fontSize: '0.9rem',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover': {
                  backgroundColor: '#ffffff',
                  border: '1px solid #0366d6',
                },
                '&.Mui-focused': {
                  backgroundColor: '#ffffff',
                  border: '1px solid #0366d6',
                  boxShadow: '0 0 0 3px rgba(3, 102, 214, 0.3)',
                }
              },
              '& .MuiInputBase-input': {
                padding: '8px 12px',
                color: '#24292e',
                '&::placeholder': {
                  color: '#6a737d',
                  opacity: 1,
                }
              }
            }}
          />
        </Box>

        {/* Desktop Table View */}
        <Box sx={{ 
          display: { xs: 'none', md: 'block' },
          backgroundColor: '#ffffff',
          borderRadius: '6px',
          border: '1px solid #e1e4e8',
          overflow: 'hidden'
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f6f8fa' }}>
                <TableCell sx={{ 
                  fontWeight: 600,
                  color: '#24292e',
                  fontSize: '0.85rem',
                  padding: '12px 16px',
                  borderBottom: '1px solid #e1e4e8'
                }}>
                  Medicine Name
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600,
                  color: '#24292e',
                  fontSize: '0.85rem',
                  padding: '12px 16px',
                  borderBottom: '1px solid #e1e4e8'
                }}>
                  ID
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600,
                  color: '#24292e',
                  fontSize: '0.85rem',
                  padding: '12px 16px',
                  borderBottom: '1px solid #e1e4e8'
                }}>
                  Stock
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600,
                  color: '#24292e',
                  fontSize: '0.85rem',
                  padding: '12px 16px',
                  borderBottom: '1px solid #e1e4e8'
                }}>
                  Expiry
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600,
                  color: '#24292e',
                  fontSize: '0.85rem',
                  padding: '12px 16px',
                  borderBottom: '1px solid #e1e4e8'
                }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMedicines.map((medicine, index) => (
                <TableRow 
                  key={medicine.id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: '#f6f8fa' 
                    },
                    borderBottom: index < filteredMedicines.length - 1 ? '1px solid #e1e4e8' : 'none'
                  }}
                >
                  <TableCell sx={{ 
                    padding: '12px 16px',
                    borderBottom: 'none'
                  }}>
                    {editingId === medicine.id ? (
                      <TextField
                        value={editForm.name || medicine.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        size="small"
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#f6f8fa',
                            borderRadius: '4px',
                            fontSize: '0.9rem',
                            '& fieldset': {
                              border: '1px solid #e1e4e8',
                            },
                            '&:hover fieldset': {
                              borderColor: '#0366d6',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#0366d6',
                            }
                          }
                        }}
                      />
                    ) : (
                      <Typography 
                        sx={{ 
                          color: '#0366d6',
                          fontSize: '0.9rem',
                          fontWeight: 500
                        }}
                      >
                        {medicine.name}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#586069',
                    fontSize: '0.85rem',
                    padding: '12px 16px',
                    borderBottom: 'none'
                  }}>
                    Ph{medicine.id.toString().padStart(2, '0')}
                  </TableCell>
                  <TableCell sx={{ 
                    padding: '12px 16px',
                    borderBottom: 'none'
                  }}>
                    {editingId === medicine.id ? (
                      <TextField
                        type="number"
                        value={editForm.stock ?? medicine.stock}
                        onChange={(e) => setEditForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                        size="small"
                        inputProps={{ min: 0 }}
                        sx={{
                          width: '100px',
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#f6f8fa',
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            '& fieldset': {
                              border: '1px solid #e1e4e8',
                            },
                            '&:hover fieldset': {
                              borderColor: '#0366d6',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#0366d6',
                            }
                          }
                        }}
                      />
                    ) : (
                      <Typography 
                        sx={{ 
                          color: medicine.status === 'in-stock' ? '#28a745' : 
                                 medicine.status === 'low-stock' ? '#28a745' : '#dc3545',
                          fontSize: '0.85rem',
                          fontWeight: 500
                        }}
                      >
                        {medicine.status === 'out-of-stock' ? 'Out of Stock' : 'In Stock'}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ 
                    padding: '12px 16px',
                    borderBottom: 'none'
                  }}>
                    {editingId === medicine.id ? (
                      <TextField
                        type="date"
                        value={editForm.expiryDate || medicine.expiryDate}
                        onChange={(e) => setEditForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#f6f8fa',
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            '& fieldset': {
                              border: '1px solid #e1e4e8',
                            },
                            '&:hover fieldset': {
                              borderColor: '#0366d6',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#0366d6',
                            }
                          }
                        }}
                      />
                    ) : (
                      <Typography sx={{ 
                        color: '#586069',
                        fontSize: '0.85rem'
                      }}>
                        {new Date(medicine.expiryDate).toLocaleDateString('en-GB')}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ 
                    padding: '12px 16px',
                    borderBottom: 'none'
                  }}>
                    {editingId === medicine.id ? (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={handleEditSave}
                          sx={{ 
                            color: '#28a745',
                            '&:hover': { 
                              backgroundColor: 'rgba(40, 167, 69, 0.08)' 
                            }
                          }}
                        >
                          <SaveIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={handleEditCancel}
                          sx={{ 
                            color: '#dc3545',
                            '&:hover': { 
                              backgroundColor: 'rgba(220, 53, 69, 0.08)' 
                            }
                          }}
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditStart(medicine)}
                          sx={{ 
                            color: '#0366d6',
                            '&:hover': { 
                              backgroundColor: 'rgba(3, 102, 214, 0.08)' 
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(medicine.id)}
                          sx={{ 
                            color: '#dc3545',
                            '&:hover': { 
                              backgroundColor: 'rgba(220, 53, 69, 0.08)' 
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* Mobile Card View */}
        <Box sx={{ 
          display: { xs: 'block', md: 'none' },
          '& > *': { mb: 2 }
        }}>
          {filteredMedicines.map((medicine) => (
            <Card
              key={medicine.id}
              sx={{
                backgroundColor: '#ffffff',
                border: '1px solid #e1e4e8',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {editingId === medicine.id ? (
                  // Edit Mode
                  <Box>
                    <Typography sx={{ 
                      color: '#24292e',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      mb: 2
                    }}>
                      Edit Medicine
                    </Typography>
                    
                    <Stack spacing={2}>
                      <Box>
                        <Typography sx={{ 
                          color: '#586069',
                          fontSize: '0.85rem',
                          mb: 0.5
                        }}>
                          Medicine Name
                        </Typography>
                        <TextField
                          value={editForm.name || medicine.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          size="small"
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#f6f8fa',
                              borderRadius: '4px',
                              fontSize: '0.9rem',
                            }
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <Box>
                          <Typography sx={{ 
                            color: '#586069',
                            fontSize: '0.85rem',
                            mb: 0.5
                          }}>
                            Stock
                          </Typography>
                          <TextField
                            type="number"
                            value={editForm.stock ?? medicine.stock}
                            onChange={(e) => setEditForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                            size="small"
                            fullWidth
                            inputProps={{ min: 0 }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#f6f8fa',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                              }
                            }}
                          />
                        </Box>
                        
                        <Box>
                          <Typography sx={{ 
                            color: '#586069',
                            fontSize: '0.85rem',
                            mb: 0.5
                          }}>
                            Expiry Date
                          </Typography>
                          <TextField
                            type="date"
                            value={editForm.expiryDate || medicine.expiryDate}
                            onChange={(e) => setEditForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                            size="small"
                            fullWidth
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#f6f8fa',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                              }
                            }}
                          />
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleEditSave}
                          startIcon={<SaveIcon />}
                          sx={{ 
                            backgroundColor: '#28a745',
                            textTransform: 'none',
                            fontSize: '0.85rem'
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleEditCancel}
                          startIcon={<CancelIcon />}
                          sx={{ 
                            color: '#dc3545',
                            borderColor: '#dc3545',
                            textTransform: 'none',
                            fontSize: '0.85rem'
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Stack>
                  </Box>
                ) : (
                  // View Mode
                  <Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      mb: 2
                    }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          sx={{ 
                            color: '#0366d6',
                            fontSize: '1rem',
                            fontWeight: 600,
                            mb: 0.5
                          }}
                        >
                          {medicine.name}
                        </Typography>
                        <Typography sx={{ 
                          color: '#586069',
                          fontSize: '0.85rem'
                        }}>
                          ID: Ph{medicine.id.toString().padStart(2, '0')}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditStart(medicine)}
                          sx={{ 
                            color: '#0366d6',
                            backgroundColor: 'rgba(3, 102, 214, 0.08)',
                            borderRadius: '6px',
                            '&:hover': { 
                              backgroundColor: 'rgba(3, 102, 214, 0.12)' 
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(medicine.id)}
                          sx={{ 
                            color: '#dc3545',
                            backgroundColor: 'rgba(220, 53, 69, 0.08)',
                            borderRadius: '6px',
                            '&:hover': { 
                              backgroundColor: 'rgba(220, 53, 69, 0.12)' 
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: 2,
                      pt: 2,
                      borderTop: '1px solid #f1f3f4'
                    }}>
                      <Box>
                        <Typography sx={{ 
                          color: '#586069',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          mb: 0.5
                        }}>
                          Stock Status
                        </Typography>
                        <Typography 
                          sx={{ 
                            color: medicine.status === 'in-stock' ? '#28a745' : 
                                   medicine.status === 'low-stock' ? '#28a745' : '#dc3545',
                            fontSize: '0.9rem',
                            fontWeight: 600
                          }}
                        >
                          {medicine.status === 'out-of-stock' ? 'Out of Stock' : 'In Stock'}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography sx={{ 
                          color: '#586069',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          mb: 0.5
                        }}>
                          Expiry Date
                        </Typography>
                        <Typography sx={{ 
                          color: '#24292e',
                          fontSize: '0.9rem',
                          fontWeight: 500
                        }}>
                          {new Date(medicine.expiryDate).toLocaleDateString('en-GB')}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Add Medicine Dialog */}
      <Dialog 
        open={addDialogOpen} 
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: '6px',
            border: '1px solid #e1e4e8'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #e1e4e8',
          backgroundColor: '#f6f8fa'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#24292e' }}>
            Add New Medicine
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Medicine Name"
              value={newMedicine.name}
              onChange={(e) => setNewMedicine(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  '& fieldset': {
                    borderColor: '#e1e4e8',
                  },
                  '&:hover fieldset': {
                    borderColor: '#0366d6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0366d6',
                  }
                }
              }}
            />
            <TextField
              label="Description"
              value={newMedicine.description}
              onChange={(e) => setNewMedicine(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={2}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  '& fieldset': {
                    borderColor: '#e1e4e8',
                  },
                  '&:hover fieldset': {
                    borderColor: '#0366d6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0366d6',
                  }
                }
              }}
            />
            <TextField
              label="Initial Stock"
              type="number"
              value={newMedicine.stock}
              onChange={(e) => setNewMedicine(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
              fullWidth
              required
              inputProps={{ min: 0 }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  '& fieldset': {
                    borderColor: '#e1e4e8',
                  },
                  '&:hover fieldset': {
                    borderColor: '#0366d6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0366d6',
                  }
                }
              }}
            />
            <TextField
              label="Expiry Date"
              type="date"
              value={newMedicine.expiryDate}
              onChange={(e) => setNewMedicine(prev => ({ ...prev, expiryDate: e.target.value }))}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  '& fieldset': {
                    borderColor: '#e1e4e8',
                  },
                  '&:hover fieldset': {
                    borderColor: '#0366d6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0366d6',
                  }
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          pt: 2,
          borderTop: '1px solid #e1e4e8',
          backgroundColor: '#f6f8fa'
        }}>
          <Button 
            onClick={() => setAddDialogOpen(false)}
            sx={{ 
              textTransform: 'none',
              color: '#586069',
              fontWeight: 500,
              borderRadius: '6px'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddMedicine}
            variant="contained"
            sx={{
              backgroundColor: '#28a745',
              '&:hover': { backgroundColor: '#218838' },
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: '6px',
              px: 3
            }}
          >
            Add Medicine
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicineStock;