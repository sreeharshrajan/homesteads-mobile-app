import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Custom color palette for Homesteads Viands
const customColors = {
  primary: '#2e7d32', // Green for food/fresh theme
  primaryContainer: '#a5d6a7',
  secondary: '#ff6f00', // Orange accent
  secondaryContainer: '#ffb74d',
  tertiary: '#1976d2',
  tertiaryContainer: '#64b5f6',
  error: '#d32f2f',
  errorContainer: '#ffcdd2',
  success: '#388e3c',
  warning: '#f57c00',
  info: '#1976d2',
  background: '#f5f5f5',
  surface: '#ffffff',
  surfaceVariant: '#e0e0e0',
  onPrimary: '#ffffff',
  onSecondary: '#ffffff',
  onBackground: '#212121',
  onSurface: '#212121',
  outline: '#9e9e9e',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...customColors,
  },
  roundness: 8,
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


