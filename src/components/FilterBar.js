import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, Chip, Menu, Button, IconButton } from 'react-native-paper';

/**
 * FilterBar Component
 * Universal filter bar with search, status filter, and date range
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
}) => {
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {onSearchChange && (
        <Searchbar
          placeholder="Search..."
          onChangeText={onSearchChange}
          value={searchValue}
          style={styles.searchbar}
        />
      )}
      
      <View style={styles.filtersRow}>
        {statusOptions.length > 0 && (
          <Menu
            visible={statusMenuVisible}
            onDismiss={() => setStatusMenuVisible(false)}
            anchor={
              <Chip
                mode="outlined"
                onPress={() => setStatusMenuVisible(true)}
                icon="filter-variant"
                style={styles.filterChip}
              >
                {statusFilter || 'All Status'}
              </Chip>
            }
          >
            <Menu.Item
              onPress={() => {
                onStatusChange(null);
                setStatusMenuVisible(false);
              }}
              title="All Status"
            />
            {statusOptions.map((option) => (
              <Menu.Item
                key={option.value}
                onPress={() => {
                  onStatusChange(option.value);
                  setStatusMenuVisible(false);
                }}
                title={option.label}
              />
            ))}
          </Menu>
        )}

        {showDateFilter && (
          <Button
            mode="outlined"
            icon="calendar-range"
            onPress={onDateRangePress}
            style={styles.dateButton}
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
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  searchbar: {
    marginBottom: 8,
    elevation: 0,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  dateButton: {
    borderRadius: 16,
  },
});

export default FilterBar;

