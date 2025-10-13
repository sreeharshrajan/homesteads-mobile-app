import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { ROUTES } from '../utils/constants';
import { useOrders } from '../hooks';
import { FilterBar, PaginationControls, OrderCard, EmptyState } from '../components';

const OrderListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { orders, loading, pagination, fetchOrders } = useOrders();

  // Note: Orders API requires customerId or sessionId
  // For admin app, we'd typically fetch all orders via a different endpoint
  // or implement a customer selector. For now, this is a placeholder implementation.
  const loadOrders = useCallback(() => {
    // In a real implementation, you'd need to handle admin-level order access
    // This might require a different API endpoint or additional permissions
    const params = {
      page: currentPage,
      limit: 20,
      status: statusFilter || undefined,
      sortField: 'createdAt',
      sortDirection: 'desc',
    };
    
    // Note: This will need customerId - in production you'd either:
    // 1. Use an admin-specific order endpoint
    // 2. Select a customer first
    // 3. Show all orders if user has admin permissions
    // fetchOrders(params);
  }, [currentPage, statusFilter, fetchOrders]);

  useEffect(() => {
    // loadOrders();
  }, [loadOrders]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    loadOrders();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOrderPress = (order) => {
    navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: order.id });
  };

  const renderOrderCard = ({ item }) => (
    <OrderCard order={item} onPress={() => handleOrderPress(item)} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FilterBar
          searchValue={searchQuery}
          onSearchChange={handleSearch}
          statusFilter={statusFilter}
          statusOptions={[
            { value: 'PENDING', label: 'Pending' },
            { value: 'CONFIRMED', label: 'Confirmed' },
            { value: 'PROCESSING', label: 'Processing' },
            { value: 'SHIPPED', label: 'Shipped' },
            { value: 'DELIVERED', label: 'Delivered' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ]}
          onStatusChange={handleStatusChange}
        />

        {orders.length === 0 && !loading ? (
          <EmptyState
            icon="cart-outline"
            title="No orders found"
            message="Orders will appear here once customers start placing orders"
          />
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderCard}
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
});

export default OrderListScreen;

