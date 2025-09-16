/**
 * Professional Pharmacy Management App
 * Main App Component with Navigation
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import FlashMessage from 'react-native-flash-message';
// import SplashScreen from 'react-native-splash-screen';

// Navigation
import AppNavigator from './src/navigation/AppNavigator';

// Services
import apiService from './src/services/api';

// Theme
import theme, { colors } from './src/theme';

// Types
interface AppState {
  isLoading: boolean;
  isAuthenticated: boolean;
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if user is already authenticated
      const token = await apiService.getAccessToken();
      
      if (token) {
        // Verify token validity
        try {
          await apiService.healthCheck();
          setAppState({ isLoading: false, isAuthenticated: true });
        } catch (error) {
          // Token is invalid, clear it
          await apiService.clearTokens();
          setAppState({ isLoading: false, isAuthenticated: false });
        }
      } else {
        setAppState({ isLoading: false, isAuthenticated: false });
      }
    } catch (error) {
      console.error('App initialization error:', error);
      setAppState({ isLoading: false, isAuthenticated: false });
    } finally {
      // Hide splash screen
      if (Platform.OS === 'android') {
        // SplashScreen?.hide?.();
      }
    }
  };

  const handleAuthStateChange = (isAuthenticated: boolean) => {
    setAppState(prev => ({ ...prev, isAuthenticated }));
  };

  // Paper theme configuration
  const paperTheme = {
    ...theme,
    colors: {
      primary: colors.primary,
      accent: colors.secondary,
      background: colors.background,
      surface: colors.backgroundWhite,
      text: colors.text,
      placeholder: colors.textLight,
      disabled: colors.textLight,
      error: colors.error,
      notification: colors.success,
    },
  };

  return (
    <PaperProvider theme={paperTheme}>
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={colors.primaryDark}
          barStyle="light-content"
          translucent={false}
        />
        <NavigationContainer>
          <AppNavigator
            isAuthenticated={appState.isAuthenticated}
            isLoading={appState.isLoading}
            onAuthStateChange={handleAuthStateChange}
          />
        </NavigationContainer>
        <FlashMessage
          position="top"
          titleStyle={styles.flashMessageTitle}
          textStyle={styles.flashMessageText}
        />
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flashMessageTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  flashMessageText: {
    fontSize: 14,
    lineHeight: 18,
  },
});

export default App;