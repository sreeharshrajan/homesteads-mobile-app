import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image, Easing } from 'react-native';
import { Text } from 'react-native-paper';
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
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial Entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1)),
      }),
      // Subtle progress bar simulation
      Animated.timing(progressAnim, {
        toValue: 0.6,
        duration: 2000,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isAppReady) {
      // Finalize progress then fade out
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start(async () => {
        await SplashScreen.hideAsync();
      });
    }
  }, [isAppReady]);

  return (
    <View style={styles.container}>
      {children}

      <Animated.View
        pointerEvents={isAppReady ? 'none' : 'auto'}
        style={[styles.splashOverlay, { opacity: fadeAnim }]}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
          <Image source={require('@assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.brandText}>HOMESTEADS VIANDS</Text>
          <Text style={styles.tagline}>Made with love & care</Text>
        </Animated.View>

        {/* Minimal Progress Line */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    // Greyscale or Tint color can be applied here if needed
  },
  brandText: {
    fontSize: 22,
    letterSpacing: 6,
    fontWeight: '300',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: '#999',
    textTransform: 'uppercase',
  },
  progressTrack: {
    position: 'absolute',
    bottom: 80,
    width: 140,
    height: 2,
    backgroundColor: '#F0F0F0',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2e7d32', // Brand accent
  },
});

export default AnimatedSplashScreen;
