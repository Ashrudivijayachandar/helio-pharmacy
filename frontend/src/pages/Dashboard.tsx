/**
 * Dashboard page component
 */

import React, { useEffect, useState } from 'react';
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
  Chip,
  Button,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Dashboard as DashboardIcon,
  LocalPharmacy as PharmacyIcon,
  People as PeopleIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
// import { api } from '../services/api'; // Will implement API calls later

interface DashboardStats {
  totalMedicines: number;
  totalPatients: number;
  totalPrescriptions: number;
  totalPharmacies: number;
  lowStockItems: number;
  totalSales: number;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({
    totalMedicines: 0,
    totalPatients: 0,
    totalPrescriptions: 0,
    totalPharmacies: 0,
    lowStockItems: 0,
    totalSales: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data for now - will connect to API later
      setStats({
        totalMedicines: 1250,
        totalPatients: 850,
        totalPrescriptions: 2340,
        totalPharmacies: 12,
        lowStockItems: 45,
        totalSales: 125000,
      });

      // Mock recent activity data
      const mockActivity: RecentActivity[] = [
        {
          id: 1,
          type: 'prescription',
          description: 'New prescription created for Patient #123',
          timestamp: new Date().toISOString(),
          status: 'success',
        },
        {
          id: 2,
          type: 'inventory',
          description: 'Low stock alert: Paracetamol (50 units remaining)',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'warning',
        },
        {
          id: 3,
          type: 'medicine',
          description: 'New medicine added: Amoxicillin 500mg',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          status: 'success',
        },
      ];
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <Card sx={{ minWidth: 200 }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ flex: 1 }}>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h3">{value.toLocaleString()}</Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: 1,
              display: 'flex',
              height: 56,
              width: 56,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('dashboard')}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchDashboardData}
          disabled={loading}
        >
          {t('refresh')}
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={3} 
        sx={{ mb: 3 }}
        flexWrap="wrap"
      >
        <StatCard
          title={t('total_medicines')}
          value={stats.totalMedicines}
          icon={<PharmacyIcon sx={{ color: 'white' }} />}
          color="#1976d2"
        />
        <StatCard
          title={t('total_patients')}
          value={stats.totalPatients}
          icon={<PeopleIcon sx={{ color: 'white' }} />}
          color="#388e3c"
        />
        <StatCard
          title={t('prescriptions')}
          value={stats.totalPrescriptions}
          icon={<DashboardIcon sx={{ color: 'white' }} />}
          color="#f57c00"
        />
        <StatCard
          title={t('low_stock_alerts')}
          value={stats.lowStockItems}
          icon={<WarningIcon sx={{ color: 'white' }} />}
          color="#d32f2f"
        />
      </Stack>

      {/* Recent Activity and System Status */}
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
        {/* Recent Activity */}
        <Box sx={{ flex: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('recent_activity')}
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('type')}</TableCell>
                      <TableCell>{t('description')}</TableCell>
                      <TableCell>{t('time')}</TableCell>
                      <TableCell>{t('status')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivity.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            {activity.type}
                          </Typography>
                        </TableCell>
                        <TableCell>{activity.description}</TableCell>
                        <TableCell>{formatTimestamp(activity.timestamp)}</TableCell>
                        <TableCell>
                          <Chip
                            label={activity.status}
                            color={getStatusColor(activity.status) as any}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* System Status */}
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('system_status')}
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">{t('database')}</Typography>
                  <Chip label={t('online')} color="success" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">{t('api_server')}</Typography>
                  <Chip label={t('online')} color="success" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">{t('backup_system')}</Typography>
                  <Chip label={t('pending')} color="warning" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">{t('last_backup')}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    2 {t('hours_ago')}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

export default Dashboard;