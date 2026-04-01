module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@features': './src/features',
            '@components': './src/components',
            '@hooks': './src/hooks',
            '@api': './src/api',
            '@utils': './src/utils',
            '@store': './src/store',
            '@theme': './src/theme',
            '@assets': './assets'
          },
          extensions: [
            '.ios.js',
            '.android.js',
            '.js',
            '.jsx',
            '.json'
          ]
        },
      ],
    ],
  };
};

