module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-worklets/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@config': './src/config',
            '@features': './src/features',
            '@components': './src/components',
            '@hooks': './src/hooks',
            '@api': './src/api',
            '@utils': './src/utils',
            '@store': './src/store',
            '@theme': './src/theme',
            '@assets': './assets',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.ios.js', '.android.js'],
        },
      ],
    ],
  };
};
