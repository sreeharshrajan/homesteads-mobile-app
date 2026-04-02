# Splash Screen Implementation

## Overview

The app implements a beautiful, animated splash screen using `expo-splash-screen` and React Native's Animated API. The splash screen provides a smooth transition from app launch to the main interface with professional animations.

## Features

✅ **Smooth Animations**

- Logo fade-in effect
- Scale-up animation with spring physics
- Subtle rotation animation
- Cross-fade transition to app content

✅ **Native Integration**

- Uses Expo's native splash screen
- Seamless transition from native to JavaScript
- No flash or jarring transitions

✅ **Brand Consistency**

- Matches app theme colors (#2e7d32 green)
- Displays logo and app name
- Shows loading indicator

✅ **Configurable Duration**

- Automatically hides when app is ready
- Can be extended for initialization tasks

## Implementation

### 1. Installation

```bash
npm install expo-splash-screen
```

Already installed ✓

### 2. Component Structure

The splash screen is implemented in `src/components/AnimatedSplashScreen.js`:

```javascript
<AnimatedSplashScreen isAppReady={isAppReady}>
  <AppNavigator />
</AnimatedSplashScreen>
```

### 3. App Integration

In `App.js`:

```javascript
const [isAppReady, setIsAppReady] = useState(false);

useEffect(() => {
  const prepareApp = async () => {
    try {
      // App initialization logic
      await loadFonts();
      await checkAuth();
      await loadInitialData();
    } catch (error) {
      console.error('Error during app initialization:', error);
    } finally {
      setIsAppReady(true);
    }
  };

  prepareApp();
}, []);
```

### 4. Native Splash Configuration

In `app.json`:

```json
{
  "splash": {
    "image": "./assets/splash-icon.png",
    "resizeMode": "contain",
    "backgroundColor": "#ffffff"
  }
}
```

## Animations

### Logo Animations

1. **Fade In** (0 → 1 opacity, 800ms)
   - Smooth appearance of the logo

2. **Scale Up** (0.3 → 1 scale, spring animation)
   - Logo grows from small to full size
   - Uses spring physics for natural feel
   - Tension: 10, Friction: 2

3. **Rotation** (0° → 360°, 1000ms)
   - Subtle full rotation
   - Adds dynamic feel to the splash

### Transition Animation

4. **Cross-Fade** (400ms, 300ms delay)
   - Splash fades out (1 → 0 opacity)
   - Content fades in (0 → 1 opacity)
   - Simultaneous for smooth transition

## Customization

### Change Animation Duration

```javascript
// In AnimatedSplashScreen.js
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 1200, // Change from 800ms to 1200ms
  useNativeDriver: true,
});
```

### Modify Animation Style

```javascript
// Remove rotation
// Comment out or remove logoRotateAnim

// Change spring behavior
Animated.spring(scaleAnim, {
  toValue: 1,
  tension: 20, // Higher = faster
  friction: 5, // Higher = less bounce
  useNativeDriver: true,
});
```

### Change Colors

```javascript
// In styles
splashContainer: {
  backgroundColor: '#2e7d32', // Green background
},
title: {
  color: '#ffffff', // White text
},
```

### Change Minimum Display Time

```javascript
// In App.js
await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 seconds
```

## App Initialization

The splash screen is visible during app initialization. Use this time to:

### 1. Load Fonts

```javascript
import * as Font from 'expo-font';

await Font.loadAsync({
  Roboto: require('./assets/fonts/Roboto-Regular.ttf'),
  'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
});
```

### 2. Check Authentication

```javascript
import useAuthStore from './src/store/authStore';

const { initializeAuth } = useAuthStore.getState();
await initializeAuth();
```

### 3. Load Critical Data

```javascript
// Pre-load frequently used data
const initialData = await fetchInitialData();
```

### 4. Initialize Services

```javascript
// Analytics
await Analytics.initialize();

// Push notifications
await registerForPushNotifications();

// Crash reporting
await Sentry.init();
```

## Best Practices

### ✅ Do

- Keep splash screen visible for at least 1-2 seconds
- Use for critical initialization only
- Show loading indicator for user feedback
- Match splash screen to app branding
- Test on both iOS and Android
- Handle initialization errors gracefully

### ❌ Don't

- Load non-critical data during splash
- Keep splash screen visible too long (> 5 seconds)
- Fetch large amounts of data
- Make blocking API calls
- Use splash screen as loading screen for content

## Troubleshooting

### Splash Screen Not Showing

```javascript
// Make sure you're preventing auto-hide
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => {});
```

### Flash of Content

```javascript
// Ensure isAppReady starts as false
const [isAppReady, setIsAppReady] = useState(false);

// And AnimatedSplashScreen wraps entire app
<AnimatedSplashScreen isAppReady={isAppReady}>{children}</AnimatedSplashScreen>;
```

### Animations Not Smooth

```javascript
// Always use native driver when possible
useNativeDriver: true;

// Avoid layout animations during splash
// Use opacity and transform only
```

### Long Loading Times

```javascript
// Add timeout to prevent infinite splash
const SPLASH_TIMEOUT = 10000; // 10 seconds

const timeoutId = setTimeout(() => {
  console.warn('Splash screen timeout reached');
  setIsAppReady(true);
}, SPLASH_TIMEOUT);

// Clear timeout when ready
clearTimeout(timeoutId);
```

## Testing

### Test on Real Devices

```bash
# iOS
npm run ios

# Android
npm run android
```

### Test Different Network Conditions

```javascript
// Simulate slow initialization
await new Promise((resolve) => setTimeout(resolve, 5000));
```

### Test Error Scenarios

```javascript
try {
  await initializeApp();
} catch (error) {
  // Still show app even if initialization fails
  console.error('Init error:', error);
  // Show error boundary or fallback UI
} finally {
  setIsAppReady(true);
}
```

## Performance

### Optimization Tips

1. **Use Native Driver**

   ```javascript
   useNativeDriver: true; // Runs on native thread
   ```

2. **Minimize JavaScript Work**
   - Load only critical data during splash
   - Defer non-critical tasks to after app loads

3. **Optimize Images**
   - Use compressed logo image
   - Appropriate resolution (1024x1024 recommended)

4. **Avoid Re-renders**
   ```javascript
   // Don't update state during animations
   // Wait for animation completion
   ```

## Asset Requirements

### Splash Icon

**Location:** `assets/splash-icon.png`

**Requirements:**

- Size: 1284x2778 pixels (iOS) or 1080x1920 pixels (Android)
- Format: PNG with transparency
- Content: Centered logo or brand mark
- Background: Transparent or solid color

**Generation:**

```bash
# Resize logo for splash
# Use image editing tool or online service
# Recommended: Figma, Photoshop, or online tools
```

### Logo

**Location:** `assets/logo.png`

**Requirements:**

- Size: 1024x1024 pixels
- Format: PNG with transparency
- Aspect: Square
- Use: App icon and splash screen logo

## File Structure

```
src/
  components/
    AnimatedSplashScreen.js    # Main splash component
    LoadingScreen.js            # In-app loading screen
assets/
  splash-icon.png               # Native splash image
  logo.png                      # App logo (animated)
App.js                          # Integration point
app.json                        # Splash configuration
```

## Examples

### Basic Usage

```javascript
import AnimatedSplashScreen from './src/components/AnimatedSplashScreen';

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await initApp();
      setIsReady(true);
    }
    prepare();
  }, []);

  return (
    <AnimatedSplashScreen isAppReady={isReady}>
      <MainApp />
    </AnimatedSplashScreen>
  );
}
```

### With Error Handling

```javascript
const [isReady, setIsReady] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  async function prepare() {
    try {
      await initApp();
    } catch (err) {
      setError(err);
      // Still show app with error boundary
    } finally {
      setIsReady(true);
    }
  }
  prepare();
}, []);

if (error) {
  return <ErrorBoundary error={error} />;
}

return (
  <AnimatedSplashScreen isAppReady={isReady}>
    <MainApp />
  </AnimatedSplashScreen>
);
```

### With Progress Indicator

```javascript
const [progress, setProgress] = useState(0);
const [isReady, setIsReady] = useState(false);

useEffect(() => {
  async function prepare() {
    setProgress(0.2);
    await loadFonts();

    setProgress(0.5);
    await checkAuth();

    setProgress(0.8);
    await loadData();

    setProgress(1);
    setIsReady(true);
  }
  prepare();
}, []);

// Pass progress to splash screen
<AnimatedSplashScreen isAppReady={isReady} progress={progress}>
  <MainApp />
</AnimatedSplashScreen>;
```

## Related Components

- **LoadingScreen** (`src/components/LoadingScreen.js`)
  - Use for in-app loading states
  - After splash screen is hidden
  - For loading specific screens/data

- **EmptyState** (`src/components/EmptyState.js`)
  - Use when lists are empty
  - Not for initial app loading

## Resources

- [Expo Splash Screen Docs](https://docs.expo.dev/versions/latest/sdk/splash-screen/)
- [React Native Animated API](https://reactnative.dev/docs/animated)
- [Expo App Loading](https://docs.expo.dev/versions/latest/sdk/app-loading/)
- [Splash Screen Generator](https://www.appicon.co/)

## Summary

The splash screen provides a professional first impression of your app with:

- Smooth, performant animations
- Brand-consistent design
- Proper initialization time
- Seamless transition to main app

Configure the minimum display time in `App.js` to match your app's initialization requirements.
