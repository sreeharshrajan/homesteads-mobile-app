/**
 * App Configuration
 * 
 * Centralized configuration file for the application.
 * Update these values based on your environment.
 */

const config = {
  // API Configuration
  api: {
    baseURL: 'https://admin.homesteadsviands.com/api',
    timeout: 15000,
  },

  // App Information
  app: {
    name: 'Homesteads Viands',
    version: '1.0.0',
  },

  // Feature Flags
  features: {
    enableOfflineMode: false,
    enablePushNotifications: false,
    enableBiometricAuth: false,
  },

  // UI Configuration
  ui: {
    itemsPerPage: 20,
    maxSearchResults: 50,
  },
};

export default config;

