import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';

/**
 * Configuration for status variants.
 * Centralizing this makes it easier to maintain or move to a separate config file.
 */
const STATUS_VARIANTS = {
  // Positive
  PAID: { bg: '#e8f5e9', text: '#2e7d32' },
  SUCCESS: { bg: '#e8f5e9', text: '#2e7d32' },
  DELIVERED: { bg: '#e8f5e9', text: '#2e7d32' },
  active: { bg: '#e8f5e9', text: '#2e7d32' },

  // Negative / Warning
  CANCELLED: { bg: '#fdf2f2', text: '#c62828' },
  FAILED: { bg: '#fdf2f2', text: '#c62828' },
  inactive: { bg: '#fdf2f2', text: '#c62828' },

  // Pending / Neutral
  PENDING: { bg: '#fff8e1', text: '#f57f17' },
  PROCESSING: { bg: '#f3e5f5', text: '#7b1fa2' },
  CONFIRMED: { bg: '#e3f2fd', text: '#1976d2' },

  // Default / Draft
  DRAFT: { bg: '#f5f5f5', text: '#616161' },
  SENT: { bg: '#eeeeee', text: '#424242' },
};

const StatusBadge = ({
  status,
  label,
  style,
  onPress,
  testID = 'status-badge'
}) => {
  const theme = useTheme();

  // Memoize styles to prevent recalculation unless status or theme changes
  const badgeStyle = useMemo(() => {
    const variant = STATUS_VARIANTS[status] || {
      bg: theme.colors.surfaceVariant,
      text: theme.colors.onSurfaceVariant
    };

    return {
      container: {
        backgroundColor: variant.bg,
        borderRadius: theme.roundness / 2, // Use theme roundness for consistency
        height: 24,
        justifyContent: 'center',
      },
      text: {
        color: variant.text,
        fontWeight: '600',
        fontSize: 10,
        lineHeight: 12,
      },
    };
  }, [status, theme]);

  // Fallback label logic: Label prop -> Formatted Status -> "Unknown"
  const displayLabel = useMemo(() => {
    if (label) return label;
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }, [label, status]);

  return (
    <Chip
      testID={testID}
      mode="flat"
      onPress={onPress} // Added for interactivity if needed
      disabled={!onPress} // Visually indicates if it's just a badge or a button
      style={[styles.baseChip, badgeStyle.container, style]}
      textStyle={badgeStyle.text}
      compact
    >
      {displayLabel}
    </Chip>
  );
};

const styles = StyleSheet.create({
  baseChip: {
    alignSelf: 'flex-start', // Prevent chip from stretching to full width
    borderWidth: 0,
  },
});

export default React.memo(StatusBadge);