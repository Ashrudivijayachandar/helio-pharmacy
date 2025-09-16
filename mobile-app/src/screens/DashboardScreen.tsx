/**
 * Professional Dashboard Screen
 * Main overview for pharmacy management with key metrics
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Divider,
  ProgressBar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, PieChart } from 'react-native-chart-kit';

// Services
import apiService from '../services/api';

// Theme
import { colors, spacing, typography, medicalTheme } from '../theme';

// Types
interface DashboardStats {
  totalMedicines: number;
  lowStockCount: number;
  expiringSoonCount: number;
  todaySales: number;
  weekSales: number;
  pendingPrescriptions: number;
  criticalAlerts: number;
}

interface QuickMetric {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
  backgroundColor: string;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.md * 3) / 2;

const DashboardScreen: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMedicines: 0,
    lowStockCount: 0,
    expiringSoonCount: 0,
    todaySales: 0,
    weekSales: 0,
    pendingPrescriptions: 0,
    criticalAlerts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would be a single API call
      // const dashboardData = await apiService.getDashboardStats();
      
      // Simulated data for demonstration
      setStats({
        totalMedicines: 1247,
        lowStockCount: 23,
        expiringSoonCount: 15,
        todaySales: 45680,
        weekSales: 298450,
        pendingPrescriptions: 12,
        criticalAlerts: 5,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const quickMetrics: QuickMetric[] = [
    {
      id: 'inventory',
      title: 'Total Medicines',
      value: stats.totalMedicines,
      subtitle: 'In inventory',
      icon: 'medical-bag',
      color: colors.primary,
      backgroundColor: colors.primaryLight,
      onPress: () => console.log('Navigate to inventory'),
    },
    {
      id: 'low-stock',
      title: 'Low Stock',
      value: stats.lowStockCount,
      subtitle: 'Items need reorder',
      icon: 'alert',
      color: colors.warning,
      backgroundColor: colors.warningLight,
      onPress: () => console.log('Navigate to low stock'),
    },
    {
      id: 'expiring',
      title: 'Expiring Soon',
      value: stats.expiringSoonCount,
      subtitle: 'Within 30 days',
      icon: 'clock-alert',
      color: colors.error,
      backgroundColor: colors.errorLight,
      onPress: () => console.log('Navigate to expiring items'),
    },
    {
      id: 'prescriptions',
      title: 'Pending Rx',
      value: stats.pendingPrescriptions,
      subtitle: 'Need processing',
      icon: 'file-document',
      color: colors.secondary,
      backgroundColor: colors.secondaryLight,
      onPress: () => console.log('Navigate to prescriptions'),
    },
  ];

  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [28000, 35000, 42000, 38000, 45000, 52000, 48000],
        color: (opacity = 1) => `rgba(46, 134, 171, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const topMedicinesData = [
    {
      name: 'Paracetamol',
      count: 145,
      color: colors.primary,
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
    {
      name: 'Amoxicillin',
      count: 98,
      color: colors.secondary,
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
    {
      name: 'Omeprazole',
      count: 76,
      color: colors.success,
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
    {
      name: 'Others',
      count: 234,
      color: colors.textLight,
      legendFontColor: colors.text,
      legendFontSize: 12,
    },
  ];

  const renderQuickMetric = (metric: QuickMetric) => (
    <TouchableOpacity
      key={metric.id}
      style={[styles.metricCard, { width: cardWidth }]}
      onPress={metric.onPress}
      activeOpacity={0.7}
    >
      <Card style={styles.card}>
        <Card.Content style={styles.metricContent}>
          <View style={[styles.metricIcon, { backgroundColor: metric.backgroundColor }]}>
            <Icon name={metric.icon} size={24} color={metric.color} />
          </View>
          <View style={styles.metricInfo}>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricTitle}>{metric.title}</Text>
            {metric.subtitle && (
              <Text style={styles.metricSubtitle}>{metric.subtitle}</Text>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back! 👋</Text>
          <Text style={styles.pharmacyName}>HealthCare Pharmacy</Text>
        </View>
        <View style={styles.headerActions}>
          {stats.criticalAlerts > 0 && (
            <TouchableOpacity style={styles.alertBadge}>
              <Icon name="bell-alert" size={20} color={colors.textWhite} />
              <Text style={styles.alertCount}>{stats.criticalAlerts}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Quick Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Overview</Text>
        <View style={styles.metricsGrid}>
          {quickMetrics.map(renderQuickMetric)}
        </View>
      </View>

      {/* Sales Summary */}
      <View style={styles.section}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <View>
                <Title style={styles.cardTitle}>Today's Sales</Title>
                <Text style={styles.salesAmount}>₹{stats.todaySales.toLocaleString('en-IN')}</Text>
              </View>
              <Chip
                icon="trending-up"
                style={[styles.chip, { backgroundColor: colors.successLight }]}
                textStyle={{ color: colors.success }}
              >
                +12.5%
              </Chip>
            </View>
            <Text style={styles.cardSubtitle}>
              This Week: ₹{stats.weekSales.toLocaleString('en-IN')}
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Sales Chart */}
      <View style={styles.section}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Weekly Sales Trend</Title>
            <LineChart
              data={salesData}
              width={width - spacing.md * 4}
              height={200}
              chartConfig={{
                backgroundColor: colors.backgroundWhite,
                backgroundGradientFrom: colors.backgroundWhite,
                backgroundGradientTo: colors.backgroundWhite,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(46, 134, 171, ${opacity})`,
                labelColor: () => colors.textSecondary,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: colors.primary,
                },
                formatYLabel: (value) => `₹${(Number(value) / 1000).toFixed(0)}K`,
              }}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      </View>

      {/* Top Medicines */}
      <View style={styles.section}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Top Selling Medicines</Title>
            <PieChart
              data={topMedicinesData}
              width={width - spacing.md * 4}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      </View>

      {/* Action Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            icon="plus"
            onPress={() => console.log('Add medicine')}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
          >
            Add Medicine
          </Button>
          <Button
            mode="outlined"
            icon="file-document-plus"
            onPress={() => console.log('New prescription')}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
          >
            New Prescription
          </Button>
        </View>
        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            icon="chart-line"
            onPress={() => console.log('View reports')}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
          >
            View Reports
          </Button>
          <Button
            mode="outlined"
            icon="account-plus"
            onPress={() => console.log('Add patient')}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
          >
            Add Patient
          </Button>
        </View>
      </View>

      {/* Bottom Padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  welcomeText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  pharmacyName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  alertCount: {
    color: colors.textWhite,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginLeft: 4,
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: 12,
    elevation: 2,
  },
  metricContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  metricInfo: {
    flex: 1,
  },
  metricValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  metricTitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metricSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
    marginTop: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  salesAmount: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
    marginTop: 4,
  },
  cardSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  chip: {
    alignSelf: 'flex-start',
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  actionButtonContent: {
    paddingVertical: spacing.xs,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});

export default DashboardScreen;