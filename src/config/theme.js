import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Custom minimal color palette for Homesteads Viands
const customColors = {
  primary: '#1a1a1a', // Minimal deep charcoal
  primaryContainer: '#f0f0f0',
  secondary: '#757575',
  secondaryContainer: '#eeeeee',
  tertiary: '#455a64',
  tertiaryContainer: '#e1e2e1',
  error: '#b71c1c',
  errorContainer: '#f9ebee',
  success: '#2e7d32',
  warning: '#f57c00',
  info: '#455a64',
  background: '#ffffff', // Pure white background
  surface: '#ffffff',
  surfaceVariant: '#f9f9f9',
  onPrimary: '#ffffff',
  onSecondary: '#ffffff',
  onBackground: '#1a1a1a',
  onSurface: '#1a1a1a',
  outline: '#eeeeee', // Very light borders
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...customColors,
  },
  roundness: 4, // More "stay put" and professional
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#66bb6a',
    primaryContainer: '#1b5e20',
    secondary: '#ffa726',
    secondaryContainer: '#e65100',
    tertiary: '#42a5f5',
    tertiaryContainer: '#0d47a1',
    error: '#ef5350',
    errorContainer: '#c62828',
    background: '#121212',
    surface: '#1e1e1e',
    surfaceVariant: '#2c2c2c',
  },
  roundness: 8,
};

export default lightTheme;



