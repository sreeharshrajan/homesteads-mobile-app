import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import AnimatedSplashScreen from './src/components/AnimatedSplashScreen';
import { lightTheme } from './src/config/theme';

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Simulate app initialization (fonts, assets, auth check, etc.)
    const prepareApp = async () => {
      try {
        // Add any app initialization logic here
        // Examples:
        // - Load fonts
        // - Check authentication status
        // - Fetch initial data
        // - Initialize analytics
        
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Error during app initialization:', error);
      } finally {
        setIsAppReady(true);
      }
    };

    prepareApp();
  }, []);

  return (
    <PaperProvider theme={lightTheme}>
      <StatusBar barStyle="dark-content" backgroundColor={lightTheme.colors.primary} />
      <AnimatedSplashScreen isAppReady={isAppReady}>
        <AppNavigator />
      </AnimatedSplashScreen>
    </PaperProvider>
  );
}
