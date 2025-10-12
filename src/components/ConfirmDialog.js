import React from 'react';
import { Dialog, Portal, Button, Paragraph } from 'react-native-paper';

/**
 * Reusable confirmation dialog component
 * 
 * Usage:
 * <ConfirmDialog
 *   visible={showDialog}
 *   title="Delete Customer"
 *   message="Are you sure you want to delete this customer? This action cannot be undone."
 *   onConfirm={handleDelete}
 *   onDismiss={() => setShowDialog(false)}
 *   confirmText="Delete"
 *   confirmColor="error"
 * />
 */
const ConfirmDialog = ({
  visible,
  onDismiss,
  onConfirm,
  title = 'Confirm',
  message,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  confirmColor = 'primary',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{message}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>{cancelText}</Button>
          <Button 
            onPress={handleConfirm}
            textColor={confirmColor === 'error' ? '#d32f2f' : undefined}
          >
            {confirmText}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ConfirmDialog;



