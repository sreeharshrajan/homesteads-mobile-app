import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Appbar, Searchbar, useTheme } from 'react-native-paper';
import { ROUTES } from '@utils/constants';
import { useCustomers } from '@hooks';
import { EmptyState, PaginationControls, LoadingScreen } from '@components';
import { formatPhoneNumber } from '@utils/formatters';

const InvoiceCustomerSelectScreen = ({ navigation }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Destructure with defaults to prevent "is not a function" or "undefined" crashes
  const { 
    customers = [], 
    loading = false, 
    pagination = {}, 
    fetchCustomers = () => {} 
  } = useCustomers();

  const loadCustomers = useCallback(() => {
    fetchCustomers({
      page: currentPage,
      limit: 20,
      search: searchQuery || undefined,
      isActive: true,
      sortField: 'name',
      sortDirection: 'asc',
    });
  }, [currentPage, searchQuery, fetchCustomers]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const renderCustomerCard = ({ item }) => (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      mode="outlined"
      onPress={() => navigation.navigate(ROUTES.INVOICE_PRODUCT_SELECT, { customer: item })}
    >
      <Card.Content>
        <Text variant="titleMedium" style={styles.boldText}>{item.name}</Text>
        
        {/* Conditional rendering wrapped strictly to avoid stray text nodes */}
        {!!item.email && (
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
            {item.email}
          </Text>
        )}
        
        {!!item.phone && (
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
            {formatPhoneNumber(item.phone)}
          </Text>
        )}
        
        {!!item.companyName && (
          <Text variant="labelSmall" style={[styles.company, { color: theme.colors.primary }]}>
            {item.companyName}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content 
          title="Select Customer" 
          subtitle="Step 1 of 4 • Choose recipient" 
        />
      </Appbar.Header>

      <Searchbar
        placeholder="Search customers..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
        elevation={0}
      />

      <View style={styles.content}>
        {loading && customers.length === 0 ? (
          <LoadingScreen fullScreen={false} />
        ) : (customers?.length === 0) ? (
          <EmptyState
            icon="account-search"
            title="No customers found"
            message={searchQuery ? "Try adjusting your filters" : "Create a customer to get started"}
          />
        ) : (
          <FlatList
            data={customers}
            renderItem={renderCustomerCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            initialNumToRender={10}
          />
        )}
      </View>

      {pagination?.totalPages > 1 && (
        <PaginationControls
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
          loading={loading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  searchbar: {
    margin: 16,
    borderRadius: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
  },
  boldText: {
    fontWeight: '700',
  },
  company: {
    marginTop: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default InvoiceCustomerSelectScreen;