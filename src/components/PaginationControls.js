import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, Button } from 'react-native-paper';

/**
 * PaginationControls Component
 * Handles page navigation with prev/next buttons
 */
const PaginationControls = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  loading = false,
  style,
}) => {
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <IconButton
        icon="chevron-left"
        mode="outlined"
        disabled={!hasPrevPage || loading}
        onPress={() => onPageChange(currentPage - 1)}
        size={20}
      />

      <View style={styles.pageInfo}>
        <Text variant="bodyMedium">
          Page {currentPage} of {totalPages}
        </Text>
      </View>

      <IconButton
        icon="chevron-right"
        mode="outlined"
        disabled={!hasNextPage || loading}
        onPress={() => onPageChange(currentPage + 1)}
        size={20}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  pageInfo: {
    marginHorizontal: 16,
    minWidth: 120,
    alignItems: 'center',
  },
});

export default PaginationControls;
