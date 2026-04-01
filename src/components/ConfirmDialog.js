import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Dialog, Portal, Button, Text, useTheme, MD3Colors } from 'react-native-paper';

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
  title,
  message,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  type = 'primary', // primary, error, warning, success
  icon,
  loading = false,
  dismissable = true,
  children,
}) => {
  const theme = useTheme();

  // Define color mapping based on type
  // MD3 relies heavily on the 'onSurface' color for text and tonal variations for emphasis
  const semanticConfig = {
    primary: {
      color: theme.colors.primary,
      icon: 'information-outline',
    },
    error: {
      color: theme.colors.error,
      icon: 'alert-circle-outline',
    },
    warning: {
      color: MD3Colors.error50, // MD3 standard warning color
      icon: 'alert-outline',
    },
    success: {
      color: '#2e7d32', // Safe standard success color
      icon: 'check-circle-outline',
    },
  };

  const config = semanticConfig[type] || semanticConfig.primary;
  const activeIcon = icon || config.icon;

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={dismissable ? onDismiss : undefined}
        style={styles.dialog}
        dismissable={dismissable}
      >
        <Dialog.Content style={styles.content}>
          <View style={styles.header}>
            <Dialog.Icon icon={activeIcon} size={30} color={config.color} />
            {title && (
              <Text variant="headlineSmall" style={styles.title}>
                {title}
              </Text>
            )}
          </View>

          {message && (
            <Text variant="bodyMedium" style={styles.message}>
              {message}
            </Text>
          )}

          {children && <View style={styles.customContent}>{children}</View>}
        </Dialog.Content>

        <Dialog.Actions style={styles.actions}>
          <Button
            onPress={onDismiss}
            disabled={loading}
            mode="text"
            labelStyle={styles.actionButtonLabel}
          >
            {cancelText}
          </Button>
          <Button
            onPress={onConfirm}
            loading={loading}
            disabled={loading}
            mode="contained-tonal" // Modern emphasis
            buttonColor={type !== 'primary' ? config.color : theme.colors.primaryContainer}
            textColor={type !== 'primary' ? theme.colors.onPrimary : theme.colors.onPrimaryContainer}
            style={styles.confirmButton}
            labelStyle={styles.actionButtonLabel}
          >
            {confirmText}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 28, // Distinctive MD3 extra-large corner radius
    backgroundColor: '#fff', // Or use theme.colors.surfaceContainerLow
    elevation: 3, // Very subtle elevation shadow
  },
  content: {
    paddingTop: 24, // Consistent spacing
    alignItems: 'center', // Center content for a clean look
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700', // Modern bold weight
    marginTop: 12,
  },
  message: {
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22, // Better readability
  },
  customContent: {
    width: '100%',
    marginVertical: 12,
  },
  actions: {
    paddingHorizontal: 24, // Space around actions
    paddingBottom: 20,
    justifyContent: 'flex-end', // Align buttons to the right
  },
  actionButtonLabel: {
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButton: {
    borderRadius: 20, // Rounded button corners
  },
});

export default ConfirmDialog;