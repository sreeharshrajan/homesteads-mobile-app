import React from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * LoadingScreen Component
 * Refactored for Material Design 3, Accessibility, and Safe Areas.
 */
const LoadingScreen = ({ message = 'Loading...', fullScreen = true, showLogo = true }) => {
  const theme = useTheme();

  // Opacity animation for a smoother entrance
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const Container = fullScreen ? SafeAreaView : View;

  return (
    <Container
      style={[
        styles.container,
        { backgroundColor: fullScreen ? theme.colors.background : 'transparent' },
      ]}
    >
      <Animated.View style={[styles.innerContainer, { opacity: fadeAnim }]}>
        {showLogo && (
          <Image
            source={require('@assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityRole="image"
            accessibilityLabel="App Logo"
          />
        )}

        <ActivityIndicator
          animating={true}
          size={showLogo ? 'small' : 'large'}
          color={theme.colors.primary}
          style={styles.loader}
        />

        {message && (
          <Text
            variant="bodyLarge"
            style={[styles.message, { color: theme.colors.onSurfaceVariant }]}
          >
            {message}
          </Text>
        )}
      </Animated.View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 32,
    // Subtle desaturation or tinting can be applied here if needed
  },
  loader: {
    marginBottom: 20,
  },
  message: {
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

export default React.memo(LoadingScreen);
