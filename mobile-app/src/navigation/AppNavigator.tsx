/**
 * AppNavigator - Main navigation component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

interface AppNavigatorProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  onAuthStateChange: (isAuthenticated: boolean) => void;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({
  isAuthenticated,
  isLoading,
  onAuthStateChange,
}) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading Pharmacy App...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        🏥 Pharmacy Management System
      </Text>
      <Text style={styles.statusText}>
        Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
  },
  welcomeText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default AppNavigator;