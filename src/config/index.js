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
    apiKey: 'hv_877204a96c03e361f69aef07f80f7750f42653d19f93c2df3673a27f5867f3fc',
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

