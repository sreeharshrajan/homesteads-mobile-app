import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, FAB, Chip } from 'react-native-paper';
import { ROUTES } from '../utils/constants';
import { formatPhoneNumber } from '../utils/formatters';
import { useCustomers } from '../hooks';
import { FilterBar, PaginationControls, EmptyState } from '../components';

const CustomerListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { customers, loading, pagination, fetchCustomers } = useCustomers();

  const loadCustomers = useCallback(() => {
    const params = {
      page: currentPage,
      limit: 20,
      search: searchQuery || undefined,
      isActive: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
      sortField: 'createdAt',
      sortDirection: 'desc',
    };
    fetchCustomers(params);
  }, [currentPage, searchQuery, statusFilter, fetchCustomers]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    loadCustomers();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderCustomerCard = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate(ROUTES.CUSTOMER_FORM, { customerId: item.id })}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title>{item.name}</Title>
          <Chip
            mode="outlined"
            style={[
              styles.statusChip,
              item.isActive ? styles.activeChip : styles.inactiveChip,
            ]}
          >
            {item.isActive ? 'Active' : 'Inactive'}
          </Chip>
        </View>
        {item.email && <Paragraph style={styles.email}>{item.email}</Paragraph>}
        {item.phone && <Paragraph style={styles.phone}>{formatPhoneNumber(item.phone)}</Paragraph>}
        {item.companyName && <Paragraph style={styles.company}>{item.companyName}</Paragraph>}
        {item._count && (
          <View style={styles.countsRow}>
            <Paragraph style={styles.count}>
              Orders: {item._count.orders || 0}
            </Paragraph>
            <Paragraph style={styles.count}>
              Invoices: {item._count.invoices || 0}
            </Paragraph>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FilterBar
          searchValue={searchQuery}
          onSearchChange={handleSearch}
          statusFilter={statusFilter}
          statusOptions={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
          onStatusChange={handleStatusChange}
        />

        {customers.length === 0 && !loading ? (
          <EmptyState
            icon="account-group"
            title="No customers found"
            message={searchQuery ? "Try adjusting your search" : "Add your first customer to get started"}
          />
        ) : (
          <FlatList
            data={customers}
            renderItem={renderCustomerCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
            }
          />
        )}

        {pagination.totalPages > 1 && (
          <PaginationControls
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate(ROUTES.CUSTOMER_FORM)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusChip: {
    height: 28,
  },
  activeChip: {
    backgroundColor: '#e8f5e9',
  },
  inactiveChip: {
    backgroundColor: '#ffebee',
  },
  email: {
    color: '#666',
    marginBottom: 4,
  },
  phone: {
    color: '#666',
    marginBottom: 4,
  },
  company: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  countsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  count: {
    fontSize: 12,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default CustomerListScreen;
