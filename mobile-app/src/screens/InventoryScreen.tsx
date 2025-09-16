/**
 * Professional Inventory Management Screen
 * Mobile-first design for pharmacy staff
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Searchbar,
  Card,
  Chip,
  FAB,
  Button,
  IconButton,
  Badge,
  Portal,
  Modal,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Services
import apiService from '../services/api';

// Theme
import { colors, spacing, typography, medicalTheme } from '../theme';

// Types
interface InventoryItem {
  id: string;
  medicine: {
    id: string;
    name: string;
    generic_name: string;
    brand_name: string;
    strength: string;
    dosage_form: string;
  };
  batch_number: string;
  manufacture_date: string;
  expiry_date: string;
  quantity_available: number;
  quantity_reserved: number;
  minimum_threshold: number;
  unit_price: number;
  mrp: number;
  supplier_name: string;
  is_low_stock: boolean;
  is_expired: boolean;
  days_to_expiry: number;
}

interface FilterState {
  searchQuery: string;
  showLowStock: boolean;
  expiryDays: number | null;
  sortBy: 'name' | 'expiry' | 'stock';
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - (spacing.md * 2);

const InventoryScreen: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    showLowStock: false,
    expiryDays: null,
    sortBy: 'name',
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (filters.searchQuery) {
        params.medicine_name = filters.searchQuery;
      }
      if (filters.showLowStock) {
        params.low_stock = true;
      }
      if (filters.expiryDays) {
        params.expiry_days = filters.expiryDays;
      }

      const response = await apiService.getInventory(params);
      setInventory(response.inventory || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
      Alert.alert('Error', 'Failed to load inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInventory();
    setRefreshing(false);
  }, [loadInventory]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const applyFilters = () => {
    setFilterModalVisible(false);
    loadInventory();
  };

  const getStockStatusChip = (item: InventoryItem) => {
    if (item.is_expired) {
      return (
        <Chip
          icon="alert-circle"
          style={[styles.chip, { backgroundColor: medicalTheme.stockStatus.outOfStock.backgroundColor }]}
          textStyle={{ color: medicalTheme.stockStatus.outOfStock.color }}
          compact
        >
          Expired
        </Chip>
      );
    }
    
    if (item.quantity_available === 0) {
      return (
        <Chip
          icon="package-variant-closed"
          style={[styles.chip, { backgroundColor: medicalTheme.stockStatus.outOfStock.backgroundColor }]}
          textStyle={{ color: medicalTheme.stockStatus.outOfStock.color }}
          compact
        >
          Out of Stock
        </Chip>
      );
    }
    
    if (item.is_low_stock) {
      return (
        <Chip
          icon="alert"
          style={[styles.chip, { backgroundColor: medicalTheme.stockStatus.lowStock.backgroundColor }]}
          textStyle={{ color: medicalTheme.stockStatus.lowStock.color }}
          compact
        >
          Low Stock
        </Chip>
      );
    }
    
    if (item.days_to_expiry <= 30) {
      return (
        <Chip
          icon="clock-alert"
          style={[styles.chip, { backgroundColor: medicalTheme.stockStatus.expiringSoon.backgroundColor }]}
          textStyle={{ color: medicalTheme.stockStatus.expiringSoon.color }}
          compact
        >
          Expiring Soon
        </Chip>
      );
    }
    
    return (
      <Chip
        icon="check-circle"
        style={[styles.chip, { backgroundColor: medicalTheme.stockStatus.inStock.backgroundColor }]}
        textStyle={{ color: medicalTheme.stockStatus.inStock.color }}
        compact
      >
        In Stock
      </Chip>
    );
  };

  const getMedicineTypeIcon = (dosageForm: string) => {
    const form = dosageForm.toLowerCase();
    
    if (form.includes('tablet')) return 'pill';
    if (form.includes('capsule')) return 'pill';
    if (form.includes('syrup') || form.includes('liquid')) return 'bottle-tonic';
    if (form.includes('injection')) return 'needle';
    if (form.includes('drops')) return 'eyedropper-variant';
    if (form.includes('cream') || form.includes('ointment')) return 'palette';
    
    return 'medical-bag';
  };

  const renderInventoryItem = ({ item }: { item: InventoryItem }) => (
    <Card style={styles.inventoryCard}>
      <Card.Content>
        {/* Medicine Header */}
        <View style={styles.medicineHeader}>
          <View style={styles.medicineIconContainer}>
            <Icon
              name={getMedicineTypeIcon(item.medicine.dosage_form)}
              size={24}
              color={colors.primary}
            />
          </View>
          <View style={styles.medicineInfo}>
            <Text style={styles.medicineName} numberOfLines={2}>
              {item.medicine.name}
            </Text>
            <Text style={styles.medicineDetails} numberOfLines={1}>
              {item.medicine.strength} • {item.medicine.dosage_form}
            </Text>
            <Text style={styles.medicineGeneric} numberOfLines={1}>
              {item.medicine.generic_name || item.medicine.brand_name}
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <IconButton
              icon="pencil"
              size={20}
              iconColor={colors.primary}
              onPress={() => handleEditItem(item)}
            />
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Stock Information */}
        <View style={styles.stockInfo}>
          <View style={styles.stockRow}>
            <View style={styles.stockItem}>
              <Text style={styles.stockLabel}>Available</Text>
              <Text style={styles.stockValue}>{item.quantity_available}</Text>
            </View>
            <View style={styles.stockItem}>
              <Text style={styles.stockLabel}>Reserved</Text>
              <Text style={styles.stockValue}>{item.quantity_reserved}</Text>
            </View>
            <View style={styles.stockItem}>
              <Text style={styles.stockLabel}>Min. Threshold</Text>
              <Text style={styles.stockValue}>{item.minimum_threshold}</Text>
            </View>
          </View>

          <View style={styles.stockRow}>
            <View style={styles.stockItem}>
              <Text style={styles.stockLabel}>Unit Price</Text>
              <Text style={styles.priceValue}>₹{item.unit_price.toFixed(2)}</Text>
            </View>
            <View style={styles.stockItem}>
              <Text style={styles.stockLabel}>MRP</Text>
              <Text style={styles.priceValue}>₹{item.mrp.toFixed(2)}</Text>
            </View>
            <View style={styles.stockItem}>
              <Text style={styles.stockLabel}>Batch</Text>
              <Text style={styles.stockValue}>{item.batch_number}</Text>
            </View>
          </View>
        </View>

        {/* Status and Expiry */}
        <View style={styles.statusRow}>
          {getStockStatusChip(item)}
          <View style={styles.expiryInfo}>
            <Icon name="calendar" size={16} color={colors.textLight} />
            <Text style={styles.expiryText}>
              Exp: {new Date(item.expiry_date).toLocaleDateString('en-IN')}
            </Text>
            {item.days_to_expiry <= 30 && (
              <Text style={styles.expiryDays}>
                ({item.days_to_expiry} days)
              </Text>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const handleEditItem = (item: InventoryItem) => {
    // Navigate to edit screen or show modal
    console.log('Edit item:', item);
  };

  const handleAddInventory = () => {
    // Navigate to add inventory screen
    console.log('Add inventory');
  };

  const FilterModal = () => (
    <Portal>
      <Modal
        visible={filterModalVisible}
        onDismiss={() => setFilterModalVisible(false)}
        contentContainerStyle={styles.modalContent}
      >
        <Text style={styles.modalTitle}>Filter Inventory</Text>
        
        <View style={styles.filterOption}>
          <Button
            mode={filters.showLowStock ? 'contained' : 'outlined'}
            onPress={() => setFilters(prev => ({ ...prev, showLowStock: !prev.showLowStock }))}
            icon="alert"
            compact
          >
            Low Stock Only
          </Button>
        </View>

        <View style={styles.filterOption}>
          <Text style={styles.filterLabel}>Expiring Within:</Text>
          <View style={styles.filterButtons}>
            {[7, 15, 30, 60].map(days => (
              <Button
                key={days}
                mode={filters.expiryDays === days ? 'contained' : 'outlined'}
                onPress={() => setFilters(prev => ({ 
                  ...prev, 
                  expiryDays: prev.expiryDays === days ? null : days 
                }))}
                compact
                style={styles.filterButton}
              >
                {days}d
              </Button>
            ))}
          </View>
        </View>

        <View style={styles.modalActions}>
          <Button
            mode="outlined"
            onPress={() => {
              setFilters({
                searchQuery: '',
                showLowStock: false,
                expiryDays: null,
                sortBy: 'name',
              });
            }}
          >
            Clear
          </Button>
          <Button mode="contained" onPress={applyFilters}>
            Apply Filters
          </Button>
        </View>
      </Modal>
    </Portal>
  );

  return (
    <View style={styles.container}>
      {/* Search and Filter Header */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Search medicines..."
          onChangeText={handleSearch}
          value={filters.searchQuery}
          style={styles.searchbar}
          icon="magnify"
          clearIcon="close"
        />
        <IconButton
          icon="filter-variant"
          size={24}
          iconColor={colors.primary}
          onPress={() => setFilterModalVisible(true)}
          style={styles.headerFilterButton}
        />
      </View>

      {/* Active Filters */}
      {(filters.showLowStock || filters.expiryDays) && (
        <View style={styles.activeFilters}>
          {filters.showLowStock && (
            <Chip
              onClose={() => setFilters(prev => ({ ...prev, showLowStock: false }))}
              style={styles.activeFilterChip}
            >
              Low Stock
            </Chip>
          )}
          {filters.expiryDays && (
            <Chip
              onClose={() => setFilters(prev => ({ ...prev, expiryDays: null }))}
              style={styles.activeFilterChip}
            >
              Expiring in {filters.expiryDays}d
            </Chip>
          )}
        </View>
      )}

      {/* Inventory List */}
      <FlatList
        data={inventory}
        renderItem={renderInventoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="package-variant" size={64} color={colors.textLight} />
            <Text style={styles.emptyStateText}>
              {loading ? 'Loading inventory...' : 'No medicines found'}
            </Text>
          </View>
        }
      />

      {/* Add Inventory FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddInventory}
        color={colors.textWhite}
      />

      {/* Filter Modal */}
      <FilterModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    backgroundColor: colors.backgroundWhite,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchbar: {
    flex: 1,
    elevation: 0,
    backgroundColor: colors.backgroundGray,
  },
  headerFilterButton: {
    margin: 0,
    marginLeft: spacing.sm,
  },
  activeFilters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activeFilterChip: {
    marginRight: spacing.sm,
  },
  listContainer: {
    padding: spacing.md,
    paddingBottom: spacing['5xl'],
  },
  inventoryCard: {
    width: CARD_WIDTH,
    marginBottom: spacing.md,
    elevation: 3,
    borderRadius: 12,
  },
  medicineHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  medicineIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    lineHeight: 22,
  },
  medicineDetails: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  medicineGeneric: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
    fontStyle: 'italic',
    marginTop: 1,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  divider: {
    marginVertical: spacing.md,
  },
  stockInfo: {
    marginBottom: spacing.md,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  stockItem: {
    flex: 1,
    alignItems: 'center',
  },
  stockLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
    marginBottom: 2,
  },
  stockValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  priceValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.success,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    alignSelf: 'flex-start',
  },
  expiryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryText: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
    marginLeft: 4,
  },
  expiryDays: {
    fontSize: typography.fontSize.xs,
    color: colors.warning,
    marginLeft: 4,
    fontWeight: typography.fontWeight.medium,
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['4xl'],
  },
  emptyStateText: {
    fontSize: typography.fontSize.lg,
    color: colors.textLight,
    marginTop: spacing.md,
  },
  modalContent: {
    backgroundColor: colors.backgroundWhite,
    padding: spacing.xl,
    margin: spacing.xl,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  filterOption: {
    marginBottom: spacing.lg,
  },
  filterLabel: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    marginBottom: spacing.sm,
    fontWeight: typography.fontWeight.medium,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterButton: {
    minWidth: 60,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
});

export default InventoryScreen;