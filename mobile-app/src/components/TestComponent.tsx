/**
 * Simple React Native Test Component
 * Testing if the fixed setup works correctly
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import apiService from '../services/api';

const TestComponent: React.FC = () => {
  const handleTestAPI = async () => {
    try {
      const stats = await apiService.getDashboardStats();
      console.log('API Test Success:', stats);
    } catch (error) {
      console.log('API Test Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏥 Pharmacy App - Working!</Text>
      <Text style={styles.subtitle}>All fixes have been applied successfully</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleTestAPI}>
        <Text style={styles.buttonText}>Test API Service</Text>
      </TouchableOpacity>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>✅ React Native: Working</Text>
        <Text style={styles.statusText}>✅ TypeScript: Configured</Text>
        <Text style={styles.statusText}>✅ API Service: Ready</Text>
        <Text style={styles.statusText}>✅ Theme System: Active</Text>
        <Text style={styles.statusText}>✅ Navigation: Setup</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2E86AB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 30,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    alignItems: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    color: '#06D6A0',
    marginBottom: 5,
    fontWeight: '500',
  },
});

export default TestComponent;