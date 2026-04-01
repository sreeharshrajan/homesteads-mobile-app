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
          iconColor="#757575"
          placeholderTextColor="#9e9e9e"
          inputStyle={styles.searchInput}
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
                style={styles.filterChip}
                textStyle={styles.filterChipText}
              >
                {statusFilter || 'Status'}
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
    paddingBottom: 12,
    backgroundColor: '#ffffff',
  },
  searchbar: {
    marginBottom: 12,
    elevation: 0,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    height: 44,
  },
  searchInput: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    backgroundColor: '#ffffff',
    borderColor: '#eeeeee',
    borderRadius: 4,
    height: 32,
  },
  filterChipText: {
    fontSize: 12,
    color: '#757575',
  },
  dateButton: {
    borderRadius: 4,
    borderColor: '#eeeeee',
    height: 32,
  },
});

export default FilterBar;

