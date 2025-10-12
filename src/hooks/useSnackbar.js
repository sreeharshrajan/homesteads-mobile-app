import { useState, useCallback } from 'react';

/**
 * Custom hook for managing Snackbar state
 * 
 * Usage:
 * const { visible, message, showSnackbar, hideSnackbar } = useSnackbar();
 * 
 * // Show snackbar
 * showSnackbar('Customer saved successfully!');
 * 
 * // In render
 * <Snackbar visible={visible} onDismiss={hideSnackbar}>
 *   {message}
 * </Snackbar>
 */
const useSnackbar = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [action, setAction] = useState(null);

  const showSnackbar = useCallback((msg, actionConfig = null) => {
    setMessage(msg);
    setAction(actionConfig);
    setVisible(true);
  }, []);

  const hideSnackbar = useCallback(() => {
    setVisible(false);
    // Clear message after animation completes
    setTimeout(() => {
      setMessage('');
      setAction(null);
    }, 300);
  }, []);

  return {
    visible,
    message,
    action,
    showSnackbar,
    hideSnackbar,
  };
};

export default useSnackbar;

