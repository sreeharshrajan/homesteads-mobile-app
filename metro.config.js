const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure assets are properly bundled
config.resolver.assetExts.push(
  // Add any additional asset extensions if needed
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp'
);

module.exports = config;

