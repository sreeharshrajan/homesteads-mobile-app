import React from 'react';
import { Snackbar } from 'react-native-paper';

/**
 * Reusable Snackbar container component
 * 
 * Usage with useSnackbar hook:
 * const { visible, message, action, hideSnackbar } = useSnackbar();
 * 
 * <SnackbarContainer
 *   visible={visible}
 *   message={message}
 *   action={action}
 *   onDismiss={hideSnackbar}
 * />
 */
const SnackbarContainer = ({
  visible,
  message,
  action,
  onDismiss,
  duration = 3000,
  variant = 'default',
}) => {
  const getStyle = () => {
    switch (variant) {
      case 'success':
        return { backgroundColor: '#4caf50' };
      case 'error':
        return { backgroundColor: '#f44336' };
      case 'warning':
        return { backgroundColor: '#ff9800' };
      case 'info':
        return { backgroundColor: '#2196f3' };
      default:
        return {};
    }
  };

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      action={action}
      style={getStyle()}
    >
      {message}
    </Snackbar>
  );
};

export default SnackbarContainer;


