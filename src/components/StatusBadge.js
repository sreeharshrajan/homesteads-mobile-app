import React from 'react';
import { Chip } from 'react-native-paper';

/**
 * StatusBadge Component
 * Colored status indicators
 */
const StatusBadge = ({ status, label, style }) => {
  const getStatusColor = (status) => {
    const statusColors = {
      // Invoice statuses
      DRAFT: '#9E9E9E',
      SENT: '#2196F3',
      PAID: '#4CAF50',
      CANCELLED: '#F44336',
      
      // Order statuses
      PENDING: '#FFA500',
      CONFIRMED: '#2196F3',
      PROCESSING: '#9C27B0',
      SHIPPED: '#FF9800',
      DELIVERED: '#4CAF50',
      REFUNDED: '#607D8B',
      
      // Customer statuses
      active: '#4CAF50',
      inactive: '#F44336',
      
      // Payment statuses
      SUCCESS: '#4CAF50',
      FAILED: '#F44336',
      PENDING: '#FFA500',
    };
    return statusColors[status] || '#757575';
  };

  const backgroundColor = getStatusColor(status);
  const displayLabel = label || status?.replace(/_/g, ' ') || 'Unknown';

  return (
    <Chip
      mode="flat"
      style={[{ backgroundColor }, style]}
      textStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 11 }}
    >
      {displayLabel.toUpperCase()}
    </Chip>
  );
};

export default StatusBadge;

