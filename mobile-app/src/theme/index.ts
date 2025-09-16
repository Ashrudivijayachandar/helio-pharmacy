/**
 * Professional Medical Theme for Pharmacy App
 * Designed for healthcare professionals with accessibility in mind
 */

export const colors = {
  // Primary Medical Theme
  primary: '#2E86AB',        // Professional medical blue
  primaryLight: '#A2D2FF',   // Light blue for backgrounds
  primaryDark: '#1F5F80',    // Dark blue for headers
  
  // Secondary Colors
  secondary: '#F18F01',      // Warm orange for accents
  secondaryLight: '#FFE5B4', // Light orange for highlights
  secondaryDark: '#C96005',  // Dark orange for emphasis
  
  // Status Colors
  success: '#06D6A0',        // Medical green for success states
  successLight: '#B8F2E6',   // Light green backgrounds
  warning: '#FFD23F',        // Warning yellow
  warningLight: '#FFF3C4',   // Light warning backgrounds
  error: '#EF476F',          // Medical red for alerts/errors
  errorLight: '#FFD6E1',     // Light red backgrounds
  
  // Medical Status Colors
  critical: '#DC2626',       // Critical alerts (red)
  urgent: '#F59E0B',         // Urgent notifications (amber)
  normal: '#10B981',         // Normal status (emerald)
  
  // Neutral Colors
  text: '#1A202C',           // Dark gray for primary text
  textSecondary: '#4A5568',  // Medium gray for secondary text
  textLight: '#718096',      // Light gray for hints
  textWhite: '#FFFFFF',      // White text
  
  // Background Colors
  background: '#F7FAFC',     // Light background
  backgroundWhite: '#FFFFFF', // Pure white cards
  backgroundGray: '#EDF2F7', // Light gray sections
  
  // Border Colors
  border: '#E2E8F0',         // Light borders
  borderMedium: '#CBD5E0',   // Medium borders
  borderDark: '#A0AEC0',     // Dark borders
  
  // Shadow Colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.15)',
  shadowDark: 'rgba(0, 0, 0, 0.25)',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const typography = {
  // Font Families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,    // Captions, small labels
    sm: 14,    // Body text, form inputs
    base: 16,  // Default body text
    lg: 18,    // Large body text
    xl: 20,    // Section headers
    '2xl': 24, // Screen titles
    '3xl': 28, // Large titles
    '4xl': 32, // Hero text
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  // Font Weights
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  base: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  base: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  md: {
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  lg: {
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Component-specific themes
export const components = {
  button: {
    primary: {
      backgroundColor: colors.primary,
      color: colors.textWhite,
    },
    secondary: {
      backgroundColor: colors.secondary,
      color: colors.textWhite,
    },
    success: {
      backgroundColor: colors.success,
      color: colors.textWhite,
    },
    warning: {
      backgroundColor: colors.warning,
      color: colors.text,
    },
    error: {
      backgroundColor: colors.error,
      color: colors.textWhite,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: colors.primary,
      borderWidth: 1,
      color: colors.primary,
    },
  },
  
  card: {
    default: {
      backgroundColor: colors.backgroundWhite,
      borderRadius: borderRadius.md,
      ...shadows.base,
    },
    elevated: {
      backgroundColor: colors.backgroundWhite,
      borderRadius: borderRadius.lg,
      ...shadows.lg,
    },
  },
  
  input: {
    default: {
      backgroundColor: colors.backgroundWhite,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: borderRadius.base,
      color: colors.text,
      fontSize: typography.fontSize.base,
    },
    focused: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    error: {
      borderColor: colors.error,
      borderWidth: 2,
    },
  },
  
  header: {
    backgroundColor: colors.primary,
    color: colors.textWhite,
    height: 56,
  },
  
  statusBar: {
    backgroundColor: colors.primaryDark,
    barStyle: 'light-content',
  },
};

// Medical-specific theme elements
export const medicalTheme = {
  priorities: {
    critical: {
      color: colors.critical,
      backgroundColor: colors.errorLight,
      borderColor: colors.critical,
    },
    high: {
      color: colors.error,
      backgroundColor: colors.errorLight,
      borderColor: colors.error,
    },
    normal: {
      color: colors.warning,
      backgroundColor: colors.warningLight,
      borderColor: colors.warning,
    },
    low: {
      color: colors.success,
      backgroundColor: colors.successLight,
      borderColor: colors.success,
    },
  },
  
  medicineTypes: {
    tablet: { icon: 'medical-bag', color: colors.primary },
    capsule: { icon: 'pill', color: colors.secondary },
    syrup: { icon: 'bottle-tonic', color: colors.success },
    injection: { icon: 'needle', color: colors.warning },
    drops: { icon: 'eyedropper-variant', color: colors.primary },
    cream: { icon: 'palette', color: colors.secondary },
  },
  
  stockStatus: {
    inStock: {
      color: colors.success,
      backgroundColor: colors.successLight,
      text: 'In Stock',
    },
    lowStock: {
      color: colors.warning,
      backgroundColor: colors.warningLight,
      text: 'Low Stock',
    },
    outOfStock: {
      color: colors.error,
      backgroundColor: colors.errorLight,
      text: 'Out of Stock',
    },
    expiringSoon: {
      color: colors.urgent,
      backgroundColor: colors.warningLight,
      text: 'Expiring Soon',
    },
  },
};

// Accessibility settings
export const accessibility = {
  minimumTouchTarget: 44, // Minimum touch target size
  contrastRatios: {
    normal: 4.5,   // WCAG AA standard
    large: 3.0,    // WCAG AA standard for large text
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  components,
  medicalTheme,
  accessibility,
};