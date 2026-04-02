import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Icon, useTheme } from 'react-native-paper';

/**
 * EmptyState Component
 * A production-ready placeholder for empty lists or missing content.
 */
const EmptyState = ({
  icon = 'inbox-outline',
  title = 'No data found',
  message,
  actionLabel,
  onAction,
  loading = false, // Added to handle loading states
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]} accessibilityRole="summary">
      {/* Icon with themed color */}
      <Icon source={icon} size={72} color={theme.colors.outlineVariant} />

      {/* Title using Paper's Headline typography */}
      <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
        {title}
      </Text>

      {/* Message using Paper's Body typography */}
      {message && (
        <Text
          variant="bodyMedium"
          style={[styles.message, { color: theme.colors.onSurfaceVariant }]}
        >
          {message}
        </Text>
      )}

      {/* Action Button */}
      {actionLabel && onAction && (
        <Button
          mode="contained-tonal" // Often preferred for secondary screens like empty states
          onPress={onAction}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32, // Increased padding for better visual breathability
    textAlign: 'center',
  },
  title: {
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20, // Prevents text from hitting the edges on small screens
  },
  button: {
    minWidth: 160,
    borderRadius: 8, // Or use theme.roundness
  },
  buttonContent: {
    paddingVertical: 4,
  },
});

// Memoize to prevent re-renders when parent lists refresh
export default React.memo(EmptyState);
