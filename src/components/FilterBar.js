import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, Chip, Menu, Button, useTheme } from 'react-native-paper';

/**
 * FilterBar Component
 * Refactored for Material Design 3 and semantic theming.
 */
const FilterBar = ({
  searchValue = '',
  onSearchChange,
  statusFilter = null,
  statusOptions = [],
  onStatusChange,
  showDateFilter = false,
  onDateRangePress,
  style,
  placeholder = "Search...",
}) => {
  const theme = useTheme();
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);

  const openMenu = useCallback(() => setStatusMenuVisible(true), []);
  const closeMenu = useCallback(() => setStatusMenuVisible(false), []);

  // Determine if a filter is currently active for visual feedback
  const isFilterActive = useMemo(() => !!statusFilter, [statusFilter]);

  const handleStatusSelect = useCallback((value) => {
    onStatusChange(value);
    closeMenu();
  }, [onStatusChange]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }, style]}>
      {/* Search Section */}
      {onSearchChange && (
        <Searchbar
          placeholder={placeholder}
          onChangeText={onSearchChange}
          value={searchValue}
          style={[styles.searchbar, { backgroundColor: theme.colors.surfaceVariant }]}
          inputStyle={styles.searchInput}
          mode="bar" // MD3 style preference
          elevation={0}
        />
      )}
      
      <View style={styles.filtersRow}>
        {/* Status Filter Menu */}
        {statusOptions.length > 0 && (
          <Menu
            visible={statusMenuVisible}
            onDismiss={closeMenu}
            anchorPosition="bottom"
            anchor={
              <Chip
                mode={isFilterActive ? "flat" : "outlined"}
                onPress={openMenu}
                style={[
                  styles.filterChip,
                  isFilterActive && { backgroundColor: theme.colors.secondaryContainer }
                ]}
                selected={isFilterActive}
                showSelectedOverlay
                icon={isFilterActive ? "check" : "filter-variant"}
                onClose={isFilterActive ? () => onStatusChange(null) : undefined}
                textStyle={{ fontSize: 12, color: theme.colors.onSurfaceVariant }}
              >
                {statusOptions.find(opt => opt.value === statusFilter)?.label || 'Status'}
              </Chip>
            }
          >
            <Menu.Item
              onPress={() => handleStatusSelect(null)}
              title="All Status"
              leadingIcon="layers-outline"
            />
            {statusOptions.map((option) => (
              <Menu.Item
                key={option.value}
                onPress={() => handleStatusSelect(option.value)}
                title={option.label}
                trailingIcon={statusFilter === option.value ? "check" : undefined}
              />
            ))}
          </Menu>
        )}

        {/* Date Range Action */}
        {showDateFilter && (
          <Button
            mode="outlined"
            icon="calendar-range"
            onPress={onDateRangePress}
            style={styles.dateButton}
            contentStyle={styles.dateButtonContent}
            labelStyle={{ fontSize: 12 }}
            compact
          >
            Date Range
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12, // Modern spacing using gap
  },
  searchbar: {
    borderRadius: 8,
    height: 48,
  },
  searchInput: {
    fontSize: 15,
    minHeight: 0, // Fixes vertical alignment on some Android versions
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    height: 34,
    borderRadius: 8,
  },
  dateButton: {
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
  },
  dateButtonContent: {
    height: 34,
    flexDirection: 'row-reverse', // Matches MD3 icon placement for trailing icons
  },
});

export default React.memo(FilterBar);