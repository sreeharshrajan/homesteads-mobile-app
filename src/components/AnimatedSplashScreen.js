import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';

// Keep the native splash screen visible until we hide it
SplashScreen.preventAutoHideAsync().catch(() => {
  // Handle the error in case splash screen is already hidden
});

/**
 * Animated Splash Screen Component
 * Shows a smooth animated splash screen with fade-in effects
 * 
 * @param {boolean} isAppReady - Whether the app is ready to show
 * @param {ReactNode} children - The app content to show after splash
 */
const AnimatedSplashScreen = ({ isAppReady, children }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the animations
    Animated.parallel([
      // Logo fade in and scale up
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
      // Subtle rotation
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isAppReady) {
      // Fade out splash, fade in content
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          delay: 300,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 400,
          delay: 300,
          useNativeDriver: true,
        }),
      ]).start(async () => {
        // Hide the native splash screen
        await SplashScreen.hideAsync();
      });
    }
  }, [isAppReady]);

  const spin = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Splash Screen Overlay */}
      {!isAppReady && (
        <Animated.View
          style={[
            styles.splashContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Animated.View
            style={{
              transform: [
                { scale: scaleAnim },
                { rotate: spin },
              ],
            }}
          >
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Homesteads Viands</Text>
            <Text style={styles.subtitle}>Billing & Customer Management</Text>
          </View>

          <ActivityIndicator
            size="large"
            color="#2e7d32"
            style={styles.loader}
          />
        </Animated.View>
      )}

      {/* App Content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: contentOpacity,
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loader: {
    marginTop: 24,
  },
  contentContainer: {
    flex: 1,
  },
});

export default AnimatedSplashScreen;


