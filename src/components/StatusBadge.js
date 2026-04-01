import React from 'react';
import { Chip } from 'react-native-paper';

/**
 * StatusBadge Component
 * Colored status indicators
 */
const StatusBadge = ({ status, label, style }) => {
  const getStatusColor = (status) => {
    // Quiet, minimal status colors (monochromatic gray-scale with subtle differences)
    const statusColors = {
      // Invoice & Order statuses
      DRAFT: '#f5f5f5',
      SENT: '#eeeeee',
      PAID: '#f0f4f0', // Very subtle green tint
      CANCELLED: '#fdf2f2', // Very subtle red tint
      PENDING: '#fff8e1', // Very subtle yellow tint
      CONFIRMED: '#e3f2fd', // Very subtle blue tint
      PROCESSING: '#f3e5f5', // Very subtle purple tint
      SHIPPED: '#fff3e0',
      DELIVERED: '#e8f5e9',
      REFUNDED: '#eceff1',
      
      // Customer & Payment
      active: '#e8f5e9',
      inactive: '#fdf2f2',
      SUCCESS: '#e8f5e9',
      FAILED: '#fdf2f2',
    };
    return statusColors[status] || '#f5f5f5';
  };

  const statusTextColors = {
    PAID: '#2e7d32',
    CANCELLED: '#c62828',
    active: '#2e7d32',
    inactive: '#c62828',
    SUCCESS: '#2e7d32',
    FAILED: '#c62828',
  };

  const backgroundColor = getStatusColor(status);
  const textColor = statusTextColors[status] || '#1a1a1a';
  const displayLabel = label || status?.replace(/_/g, ' ') || 'Unknown';

  return (
    <Chip
      mode="flat"
      style={[{ backgroundColor, borderRadius: 2, height: 24 }, style]}
      textStyle={{ color: textColor, fontWeight: '500', fontSize: 10 }}
    >
      {displayLabel}
    </Chip>
  );
};

export default StatusBadge;

